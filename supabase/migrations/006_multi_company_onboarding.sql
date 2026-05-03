-- ============================================================
-- Migration 006: Multi-company onboarding portal
-- Adds per-company isolation to the onboarding tables.
-- ============================================================

-- Companies / clients registered on the portal
create table if not exists onboarding_clients (
  id           uuid primary key default gen_random_uuid(),
  company_name text not null unique,
  access_code  text not null,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table onboarding_clients enable row level security;
drop policy if exists onboarding_clients_select on onboarding_clients;
drop policy if exists onboarding_clients_insert on onboarding_clients;
drop policy if exists onboarding_clients_update on onboarding_clients;
create policy onboarding_clients_select on onboarding_clients for select using (is_active = true);
create policy onboarding_clients_insert on onboarding_clients for insert with check (true);
create policy onboarding_clients_update on onboarding_clients for update using (true);

-- Add client_id to existing onboarding tables
alter table onboarding_responses add column if not exists client_id uuid references onboarding_clients(id);
alter table onboarding_comments  add column if not exists client_id uuid references onboarding_clients(id);
alter table onboarding_uploads   add column if not exists client_id uuid references onboarding_clients(id);

-- Change onboarding_responses PK to composite (table must be empty)
alter table onboarding_responses drop constraint if exists onboarding_responses_pkey;
alter table onboarding_responses alter column client_id set not null;
alter table onboarding_responses add primary key (client_id, item_id);

-- Indexes for fast per-client lookups
create index if not exists idx_onboarding_comments_client on onboarding_comments (client_id, item_id);
create index if not exists idx_onboarding_uploads_client  on onboarding_uploads  (client_id, item_id);

-- RPC: validate access code (code never returned to client)
create or replace function validate_onboarding_access(p_company_id uuid, p_code text)
returns uuid language sql security definer set search_path = public as
'select id from onboarding_clients where id = p_company_id and access_code = p_code and is_active = true limit 1';
