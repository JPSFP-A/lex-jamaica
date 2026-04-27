-- ============================================================
-- Migration 002: Schema adjustments
-- Migration 001 already creates tables, RLS, and base policies.
-- This file only adds missing invoice/task status values
-- and the trust_transactions staff access policy.
-- ============================================================

-- Extend invoice statuses to include workflow states we use
alter table public.invoices
  drop constraint if exists invoices_status_check;

alter table public.invoices
  add constraint invoices_status_check
  check (status in ('draft', 'issued', 'approved', 'sent', 'paid', 'overdue', 'void'));

-- Extend task statuses to include in_progress
alter table public.tasks
  drop constraint if exists tasks_status_check;

alter table public.tasks
  add constraint tasks_status_check
  check (status in ('todo', 'in_progress', 'doing', 'done', 'cancelled'));

-- Allow all staff to read trust accounts and transactions
-- (001 restricts to finance_or_admin only, but attorneys need read access)
drop policy if exists trust_accounts_finance_all on public.trust_accounts;
drop policy if exists trust_transactions_finance_all on public.trust_transactions;

create policy trust_accounts_staff_select on public.trust_accounts
  for select using (tenant_id = public.current_tenant_id() and public.is_staff());

create policy trust_accounts_finance_write on public.trust_accounts
  for insert with check (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());

create policy trust_accounts_finance_update on public.trust_accounts
  for update using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());

create policy trust_transactions_staff_select on public.trust_transactions
  for select using (tenant_id = public.current_tenant_id() and public.is_staff());

create policy trust_transactions_staff_insert on public.trust_transactions
  for insert with check (tenant_id = public.current_tenant_id() and public.is_staff());

create policy trust_transactions_finance_update on public.trust_transactions
  for update using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());
