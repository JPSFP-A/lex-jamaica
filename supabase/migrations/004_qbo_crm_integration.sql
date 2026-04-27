create table public.qbo_connections (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    realm_id text not null,
    company_name text,
    environment text not null default 'sandbox' check (environment in ('sandbox', 'production')),
    access_token_encrypted text,
    refresh_token_encrypted text,
    token_expires_at timestamptz,
    refresh_token_expires_at timestamptz,
    is_active boolean not null default true,
    connected_by_user_id uuid references public.profiles(id),
    connected_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (tenant_id, realm_id)
);

create table public.qbo_entity_links (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    local_table text not null,
    local_id uuid not null,
    qbo_entity_type text not null,
    qbo_entity_id text not null,
    qbo_sync_token text,
    last_synced_at timestamptz,
    created_at timestamptz not null default now(),
    unique (tenant_id, local_table, local_id, qbo_entity_type)
);

create table public.qbo_sync_jobs (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    job_type text not null check (job_type in ('push_customer', 'pull_customer', 'push_invoice', 'pull_invoice', 'pull_payment', 'full_sync')),
    direction text not null check (direction in ('push', 'pull', 'both')),
    status text not null default 'queued' check (status in ('queued', 'running', 'succeeded', 'failed')),
    entity_type text,
    entity_id uuid,
    qbo_entity_id text,
    started_at timestamptz,
    finished_at timestamptz,
    error_message text,
    metadata jsonb not null default '{}'::jsonb,
    created_by_user_id uuid references public.profiles(id),
    created_at timestamptz not null default now()
);

create table public.client_communications (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    client_id uuid references public.clients(id) on delete cascade,
    matter_id uuid references public.matters(id) on delete cascade,
    channel text not null check (channel in ('email', 'sms', 'phone', 'portal', 'whatsapp', 'meeting', 'letter')),
    direction text not null check (direction in ('inbound', 'outbound')),
    subject text,
    body text not null,
    status text not null default 'draft' check (status in ('draft', 'scheduled', 'sent', 'received', 'failed')),
    scheduled_at timestamptz,
    sent_at timestamptz,
    external_message_id text,
    created_by_user_id uuid references public.profiles(id),
    created_at timestamptz not null default now()
);

create table public.crm_activities (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    client_id uuid references public.clients(id) on delete cascade,
    matter_id uuid references public.matters(id) on delete cascade,
    activity_type text not null check (activity_type in ('call', 'email', 'meeting', 'follow_up', 'intake', 'retention', 'referral', 'complaint')),
    title text not null,
    notes text,
    outcome text,
    due_at timestamptz,
    completed_at timestamptz,
    assigned_to_user_id uuid references public.profiles(id),
    created_by_user_id uuid references public.profiles(id),
    created_at timestamptz not null default now()
);

create table public.crm_segments (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    name text not null,
    description text,
    filters jsonb not null default '{}'::jsonb,
    created_by_user_id uuid references public.profiles(id),
    created_at timestamptz not null default now()
);

create table public.crm_campaigns (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    name text not null,
    segment_id uuid references public.crm_segments(id) on delete set null,
    channel text not null check (channel in ('email', 'sms', 'portal', 'whatsapp')),
    status text not null default 'draft' check (status in ('draft', 'scheduled', 'sent', 'paused', 'cancelled')),
    message_template text not null,
    scheduled_at timestamptz,
    sent_at timestamptz,
    created_by_user_id uuid references public.profiles(id),
    created_at timestamptz not null default now()
);

create index idx_qbo_links_local on public.qbo_entity_links (tenant_id, local_table, local_id);
create index idx_qbo_jobs_status on public.qbo_sync_jobs (tenant_id, status, created_at);
create index idx_client_communications_client on public.client_communications (tenant_id, client_id, created_at);
create index idx_crm_activities_due on public.crm_activities (tenant_id, due_at, completed_at);

alter table public.qbo_connections enable row level security;
alter table public.qbo_entity_links enable row level security;
alter table public.qbo_sync_jobs enable row level security;
alter table public.client_communications enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_segments enable row level security;
alter table public.crm_campaigns enable row level security;

create policy qbo_connections_finance_all on public.qbo_connections for all using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin()) with check (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());
create policy qbo_entity_links_finance_all on public.qbo_entity_links for all using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin()) with check (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());
create policy qbo_sync_jobs_finance_all on public.qbo_sync_jobs for all using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin()) with check (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());

create policy client_communications_staff_all on public.client_communications for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy crm_activities_staff_all on public.crm_activities for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy crm_segments_staff_all on public.crm_segments for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy crm_campaigns_staff_all on public.crm_campaigns for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());

create or replace function public.queue_qbo_sync(
    job_type text,
    direction text,
    entity_type text default null,
    entity_id uuid default null,
    metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    new_id uuid;
begin
    if not public.is_finance_or_admin() then
        raise exception 'Only finance, partner, or admin users can queue QBO sync jobs.';
    end if;

    insert into public.qbo_sync_jobs (
        tenant_id,
        job_type,
        direction,
        entity_type,
        entity_id,
        metadata,
        created_by_user_id
    )
    values (
        public.current_tenant_id(),
        job_type,
        direction,
        entity_type,
        entity_id,
        metadata,
        auth.uid()
    )
    returning id into new_id;

    perform public.add_audit_event('qbo.sync_queued', 'qbo_sync_jobs', new_id, metadata);
    return new_id;
end;
$$;

create or replace function public.record_client_communication(
    client_id uuid,
    matter_id uuid,
    channel text,
    direction text,
    subject text,
    body text,
    status text default 'draft'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    new_id uuid;
begin
    if not public.is_staff() then
        raise exception 'Only staff users can record client communications.';
    end if;

    insert into public.client_communications (
        tenant_id,
        client_id,
        matter_id,
        channel,
        direction,
        subject,
        body,
        status,
        created_by_user_id
    )
    values (
        public.current_tenant_id(),
        client_id,
        matter_id,
        channel,
        direction,
        subject,
        body,
        status,
        auth.uid()
    )
    returning id into new_id;

    perform public.add_audit_event('crm.communication_recorded', 'client_communications', new_id, jsonb_build_object('channel', channel, 'status', status));
    return new_id;
end;
$$;
