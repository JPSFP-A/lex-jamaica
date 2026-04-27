-- ============================================================
-- Migration 003: Business logic RPC functions
-- Uses profiles table (id = auth.uid()) as defined in migration 001.
-- current_tenant_id() and current_user_role() already exist from 001.
-- ============================================================

-- ============================================================
-- generate_matter_number()
-- ============================================================
create or replace function public.generate_matter_number(p_tenant_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year  text := to_char(now(), 'YYYY');
  v_count integer;
begin
  select count(*) + 1 into v_count
  from public.matters
  where tenant_id = p_tenant_id
    and to_char(created_at, 'YYYY') = v_year;
  return 'MAT-' || v_year || '-' || lpad(v_count::text, 4, '0');
end;
$$;

-- ============================================================
-- generate_invoice_number()
-- ============================================================
create or replace function public.generate_invoice_number(p_tenant_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year  text := to_char(now(), 'YYYY');
  v_count integer;
begin
  select count(*) + 1 into v_count
  from public.invoices
  where tenant_id = p_tenant_id
    and to_char(created_at, 'YYYY') = v_year;
  return 'INV-' || v_year || '-' || lpad(v_count::text, 4, '0');
end;
$$;

-- ============================================================
-- get_trust_balance(p_trust_account_id)
-- Returns JSON: { balance, deposits, withdrawals }
-- ============================================================
create or replace function public.get_trust_balance(p_trust_account_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deposits    numeric(14,2) := 0;
  v_withdrawals numeric(14,2) := 0;
begin
  if not exists (
    select 1 from public.trust_accounts
    where id = p_trust_account_id
      and tenant_id = public.current_tenant_id()
  ) then
    raise exception 'Trust account not found';
  end if;

  select
    coalesce(sum(case when transaction_type = 'deposit' then amount else 0 end), 0),
    coalesce(sum(case when transaction_type != 'deposit' then amount else 0 end), 0)
  into v_deposits, v_withdrawals
  from public.trust_transactions
  where trust_account_id = p_trust_account_id
    and tenant_id = public.current_tenant_id()
    and approval_status = 'approved';

  return jsonb_build_object(
    'balance',     v_deposits - v_withdrawals,
    'deposits',    v_deposits,
    'withdrawals', v_withdrawals
  );
end;
$$;

-- ============================================================
-- create_trust_transaction()
-- Deposits auto-approve. Other types start pending.
-- Balance check happens before creating withdrawals/refunds/transfers.
-- ============================================================
create or replace function public.create_trust_transaction(
  p_trust_account_id uuid,
  p_matter_id        uuid,
  p_transaction_type text,
  p_amount           numeric,
  p_description      text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid := public.current_tenant_id();
  v_status    text;
  v_balance   numeric(14,2);
  v_tx        public.trust_transactions;
begin
  if not exists (select 1 from public.trust_accounts where id = p_trust_account_id and tenant_id = v_tenant_id) then
    raise exception 'Trust account not found';
  end if;

  if not exists (select 1 from public.matters where id = p_matter_id and tenant_id = v_tenant_id) then
    raise exception 'Matter not found';
  end if;

  if p_transaction_type = 'deposit' then
    v_status := 'approved';
  else
    select (public.get_trust_balance(p_trust_account_id) ->> 'balance')::numeric into v_balance;
    if v_balance < p_amount then
      raise exception 'Insufficient trust balance. Available: %', v_balance;
    end if;
    v_status := 'pending';
  end if;

  insert into public.trust_transactions (
    tenant_id, trust_account_id, matter_id,
    transaction_type, amount, description,
    approval_status, created_by_user_id, transaction_date
  ) values (
    v_tenant_id, p_trust_account_id, p_matter_id,
    p_transaction_type, p_amount, p_description,
    v_status, auth.uid(), current_date
  ) returning * into v_tx;

  perform public.add_audit_event('create', 'trust_transaction', v_tx.id,
    jsonb_build_object('type', p_transaction_type, 'amount', p_amount, 'status', v_status));

  return to_jsonb(v_tx);
end;
$$;

-- ============================================================
-- approve_trust_transaction()
-- Maker/checker: cannot approve your own transaction.
-- ============================================================
create or replace function public.approve_trust_transaction(
  p_transaction_id uuid,
  p_decision       text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid := public.current_tenant_id();
  v_tx        public.trust_transactions;
  v_balance   numeric(14,2);
begin
  if not public.is_finance_or_admin() then
    raise exception 'Insufficient role to approve trust transactions';
  end if;

  select * into v_tx
  from public.trust_transactions
  where id = p_transaction_id and tenant_id = v_tenant_id;

  if not found then raise exception 'Transaction not found'; end if;
  if v_tx.approval_status != 'pending' then raise exception 'Transaction is already %', v_tx.approval_status; end if;

  -- Maker/checker
  if v_tx.created_by_user_id = auth.uid() then
    raise exception 'Cannot approve a transaction you created (maker/checker rule)';
  end if;

  -- Re-check balance at approval time to prevent TOCTOU
  if p_decision = 'approved' and v_tx.transaction_type != 'deposit' then
    select (public.get_trust_balance(v_tx.trust_account_id) ->> 'balance')::numeric into v_balance;
    if v_balance < v_tx.amount then
      raise exception 'Insufficient trust balance at approval time. Available: %', v_balance;
    end if;
  end if;

  update public.trust_transactions
  set approval_status = p_decision, approved_by_user_id = auth.uid()
  where id = p_transaction_id
  returning * into v_tx;

  perform public.add_audit_event(p_decision, 'trust_transaction', p_transaction_id,
    jsonb_build_object('amount', v_tx.amount, 'type', v_tx.transaction_type));

  return to_jsonb(v_tx);
end;
$$;

-- ============================================================
-- create_invoice()
-- Atomically creates invoice + links unbilled time entries + calculates GCT.
-- ============================================================
create or replace function public.create_invoice(
  p_client_id      uuid,
  p_matter_id      uuid,
  p_apply_gct      boolean,
  p_due_at         date,
  p_time_entry_ids uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id  uuid := public.current_tenant_id();
  v_inv_number text;
  v_subtotal   numeric(14,2) := 0;
  v_tax_amount numeric(14,2) := 0;
  v_invoice    public.invoices;
begin
  if not exists (select 1 from public.clients where id = p_client_id and tenant_id = v_tenant_id) then
    raise exception 'Client not found';
  end if;

  if p_matter_id is not null and not exists (
    select 1 from public.matters where id = p_matter_id and tenant_id = v_tenant_id
  ) then
    raise exception 'Matter not found';
  end if;

  -- Sum unbilled time entries
  if p_time_entry_ids is not null and array_length(p_time_entry_ids, 1) > 0 then
    select coalesce(sum((duration_minutes::numeric / 60) * hourly_rate), 0)
    into v_subtotal
    from public.time_entries
    where id = any(p_time_entry_ids)
      and tenant_id = v_tenant_id
      and invoice_id is null;
  end if;

  v_tax_amount := case when p_apply_gct then round(v_subtotal * 0.15, 2) else 0 end;
  v_inv_number := public.generate_invoice_number(v_tenant_id);

  insert into public.invoices (
    tenant_id, client_id, matter_id, invoice_number,
    status, subtotal, tax_amount, total, due_at
  ) values (
    v_tenant_id, p_client_id, p_matter_id, v_inv_number,
    'draft', v_subtotal, v_tax_amount, v_subtotal + v_tax_amount, p_due_at
  ) returning * into v_invoice;

  -- Link time entries
  if p_time_entry_ids is not null and array_length(p_time_entry_ids, 1) > 0 then
    update public.time_entries
    set invoice_id = v_invoice.id
    where id = any(p_time_entry_ids)
      and tenant_id = v_tenant_id
      and invoice_id is null;
  end if;

  perform public.add_audit_event('create', 'invoice', v_invoice.id,
    jsonb_build_object('invoice_number', v_inv_number, 'total', v_invoice.total));

  return to_jsonb(v_invoice);
end;
$$;

-- ============================================================
-- transition_invoice()
-- Actions: 'issue' | 'mark_paid' | 'void'
-- ============================================================
create or replace function public.transition_invoice(
  p_invoice_id uuid,
  p_action     text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id  uuid := public.current_tenant_id();
  v_inv        public.invoices;
  v_new_status text;
begin
  select * into v_inv from public.invoices where id = p_invoice_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Invoice not found'; end if;

  case p_action
    when 'issue' then
      if v_inv.status != 'draft' then raise exception 'Only draft invoices can be issued'; end if;
      v_new_status := 'issued';
    when 'mark_paid' then
      if v_inv.status not in ('issued', 'overdue', 'sent') then
        raise exception 'Only issued/overdue invoices can be marked paid';
      end if;
      v_new_status := 'paid';
    when 'void' then
      if v_inv.status in ('paid', 'void') then raise exception 'Cannot void a paid or voided invoice'; end if;
      v_new_status := 'void';
      -- Release time entries back to unbilled
      update public.time_entries set invoice_id = null
      where invoice_id = p_invoice_id and tenant_id = v_tenant_id;
    else
      raise exception 'Unknown action: %', p_action;
  end case;

  update public.invoices
  set status = v_new_status,
      issued_at = case when p_action = 'issue' then current_date else issued_at end
  where id = p_invoice_id
  returning * into v_inv;

  perform public.add_audit_event(p_action, 'invoice', p_invoice_id,
    jsonb_build_object('status', v_new_status));

  return to_jsonb(v_inv);
end;
$$;

-- ============================================================
-- overdue_task_count() — dashboard stat
-- ============================================================
create or replace function public.overdue_task_count()
returns integer
language sql
security definer
stable
set search_path = public
as $$
  select count(*)::integer
  from public.tasks
  where tenant_id = public.current_tenant_id()
    and status not in ('done', 'cancelled')
    and due_at < now();
$$;

-- ============================================================
-- upcoming_events(p_days) — dashboard
-- ============================================================
create or replace function public.upcoming_events(p_days integer default 7)
returns setof public.calendar_events
language sql
security definer
stable
set search_path = public
as $$
  select *
  from public.calendar_events
  where tenant_id = public.current_tenant_id()
    and starts_at >= now()
    and starts_at <= now() + (p_days || ' days')::interval
  order by starts_at;
$$;

-- ============================================================
-- ar_summary() — dashboard AR card
-- ============================================================
create or replace function public.ar_summary()
returns table(status text, total_amount numeric)
language sql
security definer
stable
set search_path = public
as $$
  select status, coalesce(sum(total), 0) as total_amount
  from public.invoices
  where tenant_id = public.current_tenant_id()
    and status in ('issued', 'overdue')
  group by status;
$$;
