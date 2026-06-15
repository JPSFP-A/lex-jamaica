-- Migration 011: Client documents and organizer access

-- Store proposal URL, ToE URL, and any extra doc links per client
alter table onboarding_clients
  add column if not exists client_documents jsonb not null default '{}'::jsonb;

-- Separate organizer access code (HR/decision-maker at the client)
-- If set, entering this code after normal login reveals the Documents tab
alter table onboarding_clients
  add column if not exists organizer_code text;

-- Index for organizer code lookup
create index if not exists idx_clients_organizer_code
  on onboarding_clients (organizer_code)
  where organizer_code is not null;

-- RPC: validate organizer code for a client
create or replace function validate_organizer_code(p_company_id uuid, p_code text)
returns boolean
language sql security definer set search_path = public as
$$
  select exists (
    select 1 from onboarding_clients
    where id = p_company_id
      and organizer_code = p_code
      and is_active = true
  );
$$;

grant execute on function validate_organizer_code(uuid, text) to anon;
