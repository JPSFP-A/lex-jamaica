-- ============================================================
-- Migration 003: Postgres RPC functions for atomic operations
-- All functions run as SECURITY DEFINER so they can bypass RLS
-- internally but still validate tenant/role from JWT.
-- ============================================================

-- ============================================================
-- generate_matter_number()
-- Returns next sequential matter number for the tenant.
-- Format: MAT-{YYYY}-{NNNN}
-- ============================================================
create or replace function generate_matter_number(p_tenant_id uuid)
returns text
language plpgsql
as $$
declare
  v_year text := to_char(now(), 'YYYY');
  v_count integer;
begin
  select count(*) + 1 into v_count
  from matters
  where tenant_id = p_tenant_id
    and to_char(created_at, 'YYYY') = v_year;
  return 'MAT-' || v_year || '-' || lpad(v_count::text, 4, '0');
end;
$$;

-- ============================================================
-- generate_invoice_number()
-- Returns next sequential invoice number for the tenant.
-- Format: INV-{YYYY}-{NNNN}
-- ============================================================
create or replace function generate_invoice_number(p_tenant_id uuid)
returns text
language plpgsql
as $$
declare
  v_year text := to_char(now(), 'YYYY');
  v_count integer;
begin
  select count(*) + 1 into v_count
  from invoices
  where tenant_id = p_tenant_id
    and to_char(created_at, 'YYYY') = v_year;
  return 'INV-' || v_year || '-' || lpad(v_count::text, 4, '0');
end;
$$;

-- ============================================================
-- get_trust_balance(p_trust_account_id)
-- Returns current approved balance for a trust account.
-- ============================================================
create or replace function get_trust_balance(p_trust_account_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_tenant_id uuid := current_tenant_id();
  v_deposits   numeric(14,2) := 0;
  v_withdrawals numeric(14,2) := 0;
begin
  -- Validate this account belongs to the caller's tenant
  if not exists (
    select 1 from trust_accounts
    where id = p_trust_account_id and tenant_id = v_tenant_id
  ) then
    raise exception 'Trust account not found';
  end if;

  select
    coalesce(sum(case when transaction_type = 'deposit' then amount else 0 end), 0),
    coalesce(sum(case when transaction_type != 'deposit' then amount else 0 end), 0)
  into v_deposits, v_withdrawals
  from trust_transactions
  where trust_account_id = p_trust_account_id
    and tenant_id = v_tenant_id
    and approval_status = 'approved';

  return jsonb_build_object(
    'balance',      v_deposits - v_withdrawals,
    'deposits',     v_deposits,
    'withdrawals',  v_withdrawals
  );
end;
$$;

-- ============================================================
-- create_trust_transaction()
-- Atomically validates balance and inserts transaction.
-- Deposits auto-approve. Withdrawals/refunds/transfers pend.
-- ============================================================
create or replace function create_trust_transaction(
  p_trust_account_id uuid,
  p_matter_id        uuid,
  p_transaction_type text,
  p_amount           numeric,
  p_description      text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_tenant_id    uuid := current_tenant_id();
  v_user_id      uuid := current_user_db_id();
  v_status       text;
  v_balance      numeric(14,2);
  v_tx           trust_transactions;
begin
  -- Validate account belongs to tenant
  if not exists (
    select 1 from trust_accounts
    where id = p_trust_account_id and tenant_id = v_tenant_id
  ) then
    raise exception 'Trust account not found';
  end if;

  -- Validate matter belongs to tenant
  if not exists (
    select 1 from matters
    where id = p_matter_id and tenant_id = v_tenant_id
  ) then
    raise exception 'Matter not found';
  end if;

  -- Deposits auto-approve; all others start pending
  if p_transaction_type = 'deposit' then
    v_status := 'approved';
  else
    -- Check there's enough approved balance for the outflow
    select (get_trust_balance(p_trust_account_id) ->> 'balance')::numeric into v_balance;
    if v_balance < p_amount then
      raise exception 'Insufficient trust balance. Available: %', v_balance;
    end if;
    v_status := 'pending';
  end if;

  insert into trust_transactions (
    tenant_id, trust_account_id, matter_id,
    transaction_type, amount, description,
    approval_status, created_by_user_id, transaction_date
  ) values (
    v_tenant_id, p_trust_account_id, p_matter_id,
    p_transaction_type, p_amount, p_description,
    v_status, v_user_id, current_date
  ) returning * into v_tx;

  -- Audit
  insert into audit_events (tenant_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_tenant_id, v_user_id, 'create', 'trust_transaction', v_tx.id,
    jsonb_build_object('type', p_transaction_type, 'amount', p_amount, 'status', v_status));

  return to_jsonb(v_tx);
end;
$$;

-- ============================================================
-- approve_trust_transaction()
-- Approves or rejects a pending transaction.
-- Enforces maker/checker: cannot approve own transaction.
-- ============================================================
create or replace function approve_trust_transaction(
  p_transaction_id uuid,
  p_decision       text  -- 'approved' | 'rejected'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_tenant_id  uuid := current_tenant_id();
  v_user_id    uuid := current_user_db_id();
  v_role       text := current_user_role();
  v_tx         trust_transactions;
  v_balance    numeric(14,2);
begin
  -- Role check
  if v_role not in ('admin', 'partner', 'finance') then
    raise exception 'Insufficient role to approve trust transactions';
  end if;

  select * into v_tx
  from trust_transactions
  where id = p_transaction_id and tenant_id = v_tenant_id;

  if not found then
    raise exception 'Transaction not found';
  end if;

  if v_tx.approval_status != 'pending' then
    raise exception 'Transaction is already %', v_tx.approval_status;
  end if;

  -- Maker/checker: cannot approve your own transaction
  if v_tx.created_by_user_id = v_user_id then
    raise exception 'Cannot approve a transaction you created (maker/checker rule)';
  end if;

  -- If approving a withdrawal, re-verify balance to prevent TOCTOU
  if p_decision = 'approved' and v_tx.transaction_type != 'deposit' then
    select (get_trust_balance(v_tx.trust_account_id) ->> 'balance')::numeric into v_balance;
    if v_balance < v_tx.amount then
      raise exception 'Insufficient trust balance at approval time. Available: %', v_balance;
    end if;
  end if;

  update trust_transactions
  set
    approval_status     = p_decision,
    approved_by_user_id = v_user_id
  where id = p_transaction_id
  returning * into v_tx;

  -- Audit
  insert into audit_events (tenant_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_tenant_id, v_user_id, p_decision, 'trust_transaction', v_tx.id,
    jsonb_build_object('amount', v_tx.amount, 'type', v_tx.transaction_type));

  return to_jsonb(v_tx);
end;
$$;

-- ============================================================
-- create_invoice()
-- Atomically creates invoice + links time entries + calc GCT.
-- ============================================================
create or replace function create_invoice(
  p_client_id       uuid,
  p_matter_id       uuid,
  p_apply_gct       boolean,
  p_due_at          date,
  p_time_entry_ids  uuid[]
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_tenant_id     uuid := current_tenant_id();
  v_user_id       uuid := current_user_db_id();
  v_inv_number    text;
  v_subtotal      numeric(14,2) := 0;
  v_tax_amount    numeric(14,2) := 0;
  v_total         numeric(14,2) := 0;
  v_invoice       invoices;
  v_entry_total   numeric(14,2);
begin
  -- Validate client
  if not exists (select 1 from clients where id = p_client_id and tenant_id = v_tenant_id) then
    raise exception 'Client not found';
  end if;

  -- Validate matter if provided
  if p_matter_id is not null and not exists (
    select 1 from matters where id = p_matter_id and tenant_id = v_tenant_id
  ) then
    raise exception 'Matter not found';
  end if;

  -- Sum time entries
  if p_time_entry_ids is not null and array_length(p_time_entry_ids, 1) > 0 then
    select coalesce(sum((duration_minutes::numeric / 60) * hourly_rate), 0)
    into v_subtotal
    from time_entries
    where id = any(p_time_entry_ids)
      and tenant_id = v_tenant_id
      and invoice_id is null;  -- only unbilled entries
  end if;

  v_tax_amount := case when p_apply_gct then round(v_subtotal * 0.15, 2) else 0 end;
  v_total      := v_subtotal + v_tax_amount;

  v_inv_number := generate_invoice_number(v_tenant_id);

  insert into invoices (
    tenant_id, client_id, matter_id, invoice_number,
    status, subtotal, tax_amount, total, due_at
  ) values (
    v_tenant_id, p_client_id, p_matter_id, v_inv_number,
    'draft', v_subtotal, v_tax_amount, v_total, p_due_at
  ) returning * into v_invoice;

  -- Link time entries
  if p_time_entry_ids is not null and array_length(p_time_entry_ids, 1) > 0 then
    update time_entries
    set invoice_id = v_invoice.id
    where id = any(p_time_entry_ids)
      and tenant_id = v_tenant_id
      and invoice_id is null;
  end if;

  -- Audit
  insert into audit_events (tenant_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_tenant_id, v_user_id, 'create', 'invoice', v_invoice.id,
    jsonb_build_object('invoice_number', v_inv_number, 'total', v_total));

  return to_jsonb(v_invoice);
end;
$$;

-- ============================================================
-- transition_invoice(p_invoice_id, p_action)
-- Actions: 'issue' | 'mark_paid' | 'void'
-- ============================================================
create or replace function transition_invoice(
  p_invoice_id uuid,
  p_action     text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_tenant_id  uuid := current_tenant_id();
  v_user_id    uuid := current_user_db_id();
  v_inv        invoices;
  v_new_status text;
begin
  select * into v_inv
  from invoices
  where id = p_invoice_id and tenant_id = v_tenant_id;

  if not found then raise exception 'Invoice not found'; end if;

  case p_action
    when 'issue' then
      if v_inv.status != 'draft' then raise exception 'Only draft invoices can be issued'; end if;
      v_new_status := 'issued';
    when 'mark_paid' then
      if v_inv.status not in ('issued', 'overdue') then raise exception 'Only issued/overdue invoices can be marked paid'; end if;
      v_new_status := 'paid';
    when 'void' then
      if v_inv.status in ('paid', 'void') then raise exception 'Cannot void a paid or already voided invoice'; end if;
      v_new_status := 'void';
      -- Release time entries back to unbilled
      update time_entries set invoice_id = null where invoice_id = p_invoice_id and tenant_id = v_tenant_id;
    else
      raise exception 'Unknown action: %', p_action;
  end case;

  update invoices
  set
    status    = v_new_status,
    issued_at = case when p_action = 'issue' then current_date else issued_at end
  where id = p_invoice_id
  returning * into v_inv;

  insert into audit_events (tenant_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (v_tenant_id, v_user_id, p_action, 'invoice', p_invoice_id,
    jsonb_build_object('status', v_new_status));

  return to_jsonb(v_inv);
end;
$$;

-- ============================================================
-- overdue_task_count()
-- Returns count of overdue tasks for current tenant
-- ============================================================
create or replace function overdue_task_count()
returns integer
language sql
security definer
as $$
  select count(*)::integer
  from tasks
  where tenant_id = current_tenant_id()
    and status not in ('done', 'cancelled')
    and due_at < now();
$$;

-- ============================================================
-- upcoming_events(p_days)
-- Returns calendar events in the next N days
-- ============================================================
create or replace function upcoming_events(p_days integer default 7)
returns setof calendar_events
language sql
security definer
as $$
  select *
  from calendar_events
  where tenant_id = current_tenant_id()
    and starts_at >= now()
    and starts_at <= now() + (p_days || ' days')::interval
  order by starts_at;
$$;

-- ============================================================
-- ar_summary()
-- Returns AR totals grouped by invoice status
-- ============================================================
create or replace function ar_summary()
returns table(status text, total_amount numeric)
language sql
security definer
as $$
  select status, coalesce(sum(total), 0) as total_amount
  from invoices
  where tenant_id = current_tenant_id()
    and status in ('issued', 'overdue')
  group by status;
$$;
