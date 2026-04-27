-- ============================================================
-- Migration 002: Row Level Security policies
-- Every business table is scoped to the authenticated user's
-- tenant_id, which is stored in their Supabase JWT user_metadata.
-- ============================================================

-- Helper: read tenant_id from JWT user_metadata (set at signup by register-firm Edge Function)
create or replace function current_tenant_id()
returns uuid
language sql stable
as $$
  select (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid;
$$;

-- Helper: read role from JWT user_metadata
create or replace function current_user_role()
returns text
language sql stable
as $$
  select auth.jwt() -> 'user_metadata' ->> 'role';
$$;

-- Helper: read user id from JWT user_metadata (our users table id, not auth.uid)
create or replace function current_user_db_id()
returns uuid
language sql stable
as $$
  select (auth.jwt() -> 'user_metadata' ->> 'user_id')::uuid;
$$;

-- ============================================================
-- Enable RLS on every table
-- ============================================================
alter table tenants           enable row level security;
alter table users             enable row level security;
alter table clients           enable row level security;
alter table contacts          enable row level security;
alter table matters           enable row level security;
alter table matter_parties    enable row level security;
alter table tasks             enable row level security;
alter table calendar_events   enable row level security;
alter table documents         enable row level security;
alter table time_entries      enable row level security;
alter table invoices          enable row level security;
alter table trust_accounts    enable row level security;
alter table trust_transactions enable row level security;
alter table audit_events      enable row level security;

-- ============================================================
-- tenants: users can only read their own tenant row
-- ============================================================
create policy "tenant_read_own"
  on tenants for select
  using (id = current_tenant_id());

-- ============================================================
-- users: tenant scoped + users can update only their own row
-- ============================================================
create policy "users_tenant_isolation"
  on users for select
  using (tenant_id = current_tenant_id());

create policy "users_self_update"
  on users for update
  using (id = current_user_db_id() and tenant_id = current_tenant_id())
  with check (id = current_user_db_id() and tenant_id = current_tenant_id());

-- admins/partners can insert new users into their tenant
create policy "users_admin_insert"
  on users for insert
  with check (
    tenant_id = current_tenant_id()
    and current_user_role() in ('admin', 'partner')
  );

create policy "users_admin_delete"
  on users for delete
  using (
    tenant_id = current_tenant_id()
    and current_user_role() = 'admin'
  );

-- ============================================================
-- Standard tenant-isolation policy macro for business tables
-- ============================================================

-- clients
create policy "clients_tenant_isolation"
  on clients for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- contacts
create policy "contacts_tenant_isolation"
  on contacts for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- matters
create policy "matters_tenant_isolation"
  on matters for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- matter_parties
create policy "matter_parties_tenant_isolation"
  on matter_parties for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- tasks
create policy "tasks_tenant_isolation"
  on tasks for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- calendar_events
create policy "calendar_events_tenant_isolation"
  on calendar_events for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- documents
create policy "documents_tenant_isolation"
  on documents for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- time_entries
create policy "time_entries_tenant_isolation"
  on time_entries for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- invoices
create policy "invoices_tenant_isolation"
  on invoices for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- trust_accounts
create policy "trust_accounts_tenant_isolation"
  on trust_accounts for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- trust_transactions
create policy "trust_transactions_tenant_isolation"
  on trust_transactions for all
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- audit_events: insert-only for regular users, select for admin/partner/finance
create policy "audit_events_insert"
  on audit_events for insert
  with check (tenant_id = current_tenant_id());

create policy "audit_events_select"
  on audit_events for select
  using (
    tenant_id = current_tenant_id()
    and current_user_role() in ('admin', 'partner', 'finance')
  );
