-- Migration 008: Consultant permissions + audit log

-- Per-client consultant permissions (what consultant can see/do)
alter table onboarding_clients
  add column if not exists consultant_permissions jsonb not null default '{
    "mark_complete": true,
    "timeline": true,
    "accounts": true,
    "comments": true
  }'::jsonb;

-- Audit log for consultant actions
create table if not exists onboarding_audit_log (
  id         bigserial primary key,
  client_id  uuid references onboarding_clients(id) on delete set null,
  actor      text not null,   -- 'consultant' | 'admin'
  action     text not null,   -- 'mark_complete' | 'unmark_complete' | 'comment' | 'coa_add' | 'coa_remove' | 'login'
  detail     jsonb,
  logged_at  timestamptz not null default now()
);

alter table onboarding_audit_log enable row level security;
create policy audit_insert on onboarding_audit_log for insert with check (true);
create policy audit_select_deny on onboarding_audit_log for select using (false);

create index if not exists idx_audit_client on onboarding_audit_log (client_id, logged_at desc);
create index if not exists idx_audit_time   on onboarding_audit_log (logged_at desc);

-- Admin can read audit log via service-definer RPC
create or replace function get_client_audit_log(p_client_id uuid, p_limit int default 50)
returns table (
  id        bigint,
  actor     text,
  action    text,
  detail    jsonb,
  logged_at timestamptz
)
language sql security definer set search_path = public as
$$
  select id, actor, action, detail, logged_at
  from onboarding_audit_log
  where client_id = p_client_id
  order by logged_at desc
  limit p_limit;
$$;
