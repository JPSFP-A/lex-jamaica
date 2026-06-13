-- Migration 007: Login audit log for onboarding portal
-- Tracks every login attempt (success + failure) with timestamp and IP

create table if not exists onboarding_login_log (
  id           bigserial primary key,
  client_id    uuid references onboarding_clients(id) on delete set null,
  company_name text,
  success      boolean not null,
  ip_address   text,
  user_agent   text,
  logged_at    timestamptz not null default now()
);

alter table onboarding_login_log enable row level security;

-- Anon can insert (login page writes log on each attempt)
create policy login_log_insert on onboarding_login_log for insert with check (true);

-- Only admin reads (via service role or authenticated admin user)
create policy login_log_select on onboarding_login_log for select using (false);

create index if not exists idx_login_log_client   on onboarding_login_log (client_id, logged_at desc);
create index if not exists idx_login_log_time     on onboarding_login_log (logged_at desc);

-- PIN validation RPCs (secrets stored in DB, never in client JS)
-- Run once manually: INSERT INTO portal_pins VALUES ('consultant','LC2025'),('admin','ADMIN2025');
create table if not exists portal_pins (
  role text primary key,
  pin  text not null
);
alter table portal_pins enable row level security;
-- No anon read; only security definer functions can read pins
create policy portal_pins_deny on portal_pins for all using (false);

create or replace function validate_consultant_pin(p_pin text)
returns boolean language sql security definer set search_path = public as
'select exists(select 1 from portal_pins where role = ''consultant'' and pin = p_pin)';

create or replace function validate_admin_pin(p_pin text)
returns boolean language sql security definer set search_path = public as
'select exists(select 1 from portal_pins where role = ''admin'' and pin = p_pin)';

-- Update validate_onboarding_access to also log the attempt
create or replace function validate_onboarding_access(p_company_id uuid, p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id   uuid;
  v_name text;
begin
  select id, company_name into v_id, v_name
  from onboarding_clients
  where id = p_company_id and access_code = p_code and is_active = true
  limit 1;

  insert into onboarding_login_log (client_id, company_name, success)
  values (p_company_id, v_name, v_id is not null);

  return v_id;
end;
$$;
