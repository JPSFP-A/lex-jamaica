create extension if not exists pgcrypto;

create table public.tenants (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    country_code text not null default 'JM',
    currency_code text not null default 'JMD',
    created_at timestamptz not null default now()
);

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    email text not null,
    full_name text not null,
    role text not null check (role in ('admin', 'partner', 'attorney', 'associate', 'paralegal', 'secretary', 'finance', 'client')),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    unique (tenant_id, email)
);

create table public.clients (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    client_type text not null check (client_type in ('individual', 'company', 'government', 'nonprofit')),
    display_name text not null,
    legal_name text,
    email text,
    phone text,
    tax_registration_number text,
    national_id_reference text,
    address_line1 text,
    address_line2 text,
    parish text,
    country_code text not null default 'JM',
    risk_rating text not null default 'standard',
    created_by uuid references public.profiles(id),
    created_at timestamptz not null default now()
);

create table public.contacts (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    client_id uuid references public.clients(id) on delete cascade,
    full_name text not null,
    organization text,
    relationship text,
    email text,
    phone text,
    address text,
    created_at timestamptz not null default now()
);

create table public.matters (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    client_id uuid not null references public.clients(id) on delete cascade,
    matter_number text not null,
    title text not null,
    practice_area text not null,
    status text not null default 'open' check (status in ('intake', 'open', 'on_hold', 'closed', 'archived')),
    responsible_attorney_id uuid references public.profiles(id),
    parish text,
    court_name text,
    court_file_number text,
    opened_at date not null default current_date,
    closed_at date,
    budget_amount numeric(14,2),
    billing_type text not null default 'hourly',
    created_by uuid references public.profiles(id),
    created_at timestamptz not null default now(),
    unique (tenant_id, matter_number)
);

create table public.matter_parties (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    matter_id uuid not null references public.matters(id) on delete cascade,
    contact_id uuid references public.contacts(id),
    name text not null,
    party_role text not null,
    counsel_name text,
    created_at timestamptz not null default now()
);

create table public.tasks (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    matter_id uuid references public.matters(id) on delete cascade,
    assigned_to_user_id uuid references public.profiles(id),
    title text not null,
    description text,
    priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
    status text not null default 'todo' check (status in ('todo', 'doing', 'done', 'cancelled')),
    due_at timestamptz,
    completed_at timestamptz,
    created_at timestamptz not null default now()
);

create table public.calendar_events (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    matter_id uuid references public.matters(id) on delete cascade,
    title text not null,
    location text,
    event_type text not null,
    starts_at timestamptz not null,
    ends_at timestamptz,
    reminder_minutes integer[] not null default array[1440, 60],
    created_at timestamptz not null default now()
);

create table public.documents (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    matter_id uuid references public.matters(id) on delete cascade,
    client_id uuid references public.clients(id) on delete cascade,
    uploaded_by_user_id uuid references public.profiles(id),
    file_name text not null,
    storage_key text not null,
    mime_type text,
    file_size_bytes bigint,
    version_number integer not null default 1,
    confidentiality_level text not null default 'matter_team',
    created_at timestamptz not null default now()
);

create table public.time_entries (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    matter_id uuid not null references public.matters(id) on delete cascade,
    user_id uuid not null references public.profiles(id),
    activity_code text,
    description text not null,
    entry_date date not null,
    duration_minutes integer not null check (duration_minutes > 0),
    hourly_rate numeric(14,2) not null,
    billable boolean not null default true,
    invoice_id uuid,
    created_at timestamptz not null default now()
);

create table public.invoices (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    client_id uuid not null references public.clients(id),
    matter_id uuid references public.matters(id),
    invoice_number text not null,
    status text not null default 'draft' check (status in ('draft', 'approved', 'sent', 'paid', 'void')),
    currency_code text not null default 'JMD',
    subtotal numeric(14,2) not null default 0,
    tax_amount numeric(14,2) not null default 0,
    total numeric(14,2) not null default 0,
    issued_at date,
    due_at date,
    created_at timestamptz not null default now(),
    unique (tenant_id, invoice_number)
);

create table public.trust_accounts (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    bank_name text not null,
    account_name text not null,
    account_reference text not null,
    currency_code text not null default 'JMD',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.trust_transactions (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    trust_account_id uuid not null references public.trust_accounts(id),
    matter_id uuid not null references public.matters(id),
    transaction_type text not null check (transaction_type in ('deposit', 'withdrawal', 'transfer', 'refund', 'adjustment')),
    amount numeric(14,2) not null check (amount > 0),
    description text not null,
    approval_status text not null default 'pending' check (approval_status in ('pending', 'approved', 'rejected')),
    created_by_user_id uuid not null references public.profiles(id),
    approved_by_user_id uuid references public.profiles(id),
    transaction_date date not null default current_date,
    created_at timestamptz not null default now()
);

create table public.audit_events (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references public.tenants(id) on delete cascade,
    actor_user_id uuid references public.profiles(id),
    action text not null,
    entity_type text not null,
    entity_id uuid,
    ip_address inet,
    user_agent text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create table public.client_portal_messages (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    matter_id uuid not null references public.matters(id) on delete cascade,
    sender_user_id uuid references public.profiles(id),
    subject text not null,
    body text not null,
    is_client_visible boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.workflow_templates (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references public.tenants(id) on delete cascade,
    name text not null,
    practice_area text not null,
    tasks jsonb not null default '[]'::jsonb,
    document_checklist jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now()
);

create index idx_clients_tenant_search on public.clients using gin (to_tsvector('english', coalesce(display_name, '') || ' ' || coalesce(legal_name, '') || ' ' || coalesce(email, '')));
create index idx_matters_tenant_status on public.matters (tenant_id, status);
create index idx_tasks_due on public.tasks (tenant_id, due_at, status);
create index idx_audit_events_entity on public.audit_events (tenant_id, entity_type, entity_id, created_at);
create index idx_time_entries_invoice on public.time_entries (tenant_id, invoice_id);

create or replace function public.current_tenant_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
    select tenant_id from public.profiles where id = auth.uid() and is_active = true
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
    select role from public.profiles where id = auth.uid() and is_active = true
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select coalesce(public.current_user_role() in ('admin', 'partner', 'attorney', 'associate', 'paralegal', 'secretary', 'finance'), false)
$$;

create or replace function public.is_finance_or_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select coalesce(public.current_user_role() in ('admin', 'partner', 'finance'), false)
$$;

create or replace function public.add_audit_event(
    action text,
    entity_type text,
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
    insert into public.audit_events (tenant_id, actor_user_id, action, entity_type, entity_id, metadata)
    values (public.current_tenant_id(), auth.uid(), action, entity_type, entity_id, metadata)
    returning id into new_id;

    return new_id;
end;
$$;

create or replace function public.run_conflict_check(search_text text)
returns table (
    source_table text,
    record_id uuid,
    display_label text,
    match_reason text
)
language sql
security definer
set search_path = public
as $$
    select 'clients', id, display_name, 'Client name or email'
    from public.clients
    where tenant_id = public.current_tenant_id()
      and (
        display_name ilike '%' || search_text || '%'
        or coalesce(legal_name, '') ilike '%' || search_text || '%'
        or coalesce(email, '') ilike '%' || search_text || '%'
      )
    union all
    select 'matters', id, title, 'Matter title, number, or court file'
    from public.matters
    where tenant_id = public.current_tenant_id()
      and (
        title ilike '%' || search_text || '%'
        or matter_number ilike '%' || search_text || '%'
        or coalesce(court_file_number, '') ilike '%' || search_text || '%'
      )
    union all
    select 'contacts', id, full_name, 'Related contact or party'
    from public.contacts
    where tenant_id = public.current_tenant_id()
      and (
        full_name ilike '%' || search_text || '%'
        or coalesce(organization, '') ilike '%' || search_text || '%'
        or coalesce(email, '') ilike '%' || search_text || '%'
      )
$$;

create or replace function public.trust_matter_balance(matter uuid)
returns numeric
language sql
security definer
stable
set search_path = public
as $$
    select coalesce(sum(
        case
            when transaction_type = 'deposit' and approval_status = 'approved' then amount
            when transaction_type in ('withdrawal', 'refund') and approval_status = 'approved' then -amount
            else 0
        end
    ), 0)
    from public.trust_transactions
    where tenant_id = public.current_tenant_id()
      and matter_id = matter
$$;

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.contacts enable row level security;
alter table public.matters enable row level security;
alter table public.matter_parties enable row level security;
alter table public.tasks enable row level security;
alter table public.calendar_events enable row level security;
alter table public.documents enable row level security;
alter table public.time_entries enable row level security;
alter table public.invoices enable row level security;
alter table public.trust_accounts enable row level security;
alter table public.trust_transactions enable row level security;
alter table public.audit_events enable row level security;
alter table public.client_portal_messages enable row level security;
alter table public.workflow_templates enable row level security;

create policy tenants_select on public.tenants for select using (id = public.current_tenant_id());
create policy profiles_select on public.profiles for select using (tenant_id = public.current_tenant_id());
create policy profiles_update_self on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy clients_staff_all on public.clients for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy contacts_staff_all on public.contacts for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy matters_staff_all on public.matters for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy matter_parties_staff_all on public.matter_parties for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy tasks_staff_all on public.tasks for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy calendar_events_staff_all on public.calendar_events for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy documents_staff_all on public.documents for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy time_entries_staff_all on public.time_entries for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy invoices_staff_select on public.invoices for select using (tenant_id = public.current_tenant_id() and public.is_staff());
create policy invoices_finance_write on public.invoices for all using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin()) with check (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());
create policy trust_accounts_finance_all on public.trust_accounts for all using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin()) with check (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());
create policy trust_transactions_finance_all on public.trust_transactions for all using (tenant_id = public.current_tenant_id() and public.is_finance_or_admin()) with check (tenant_id = public.current_tenant_id() and public.is_finance_or_admin());
create policy audit_events_staff_select on public.audit_events for select using (tenant_id = public.current_tenant_id() and public.is_staff());
create policy audit_events_staff_insert on public.audit_events for insert with check (tenant_id = public.current_tenant_id() and actor_user_id = auth.uid());
create policy client_portal_messages_staff_all on public.client_portal_messages for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());
create policy workflow_templates_staff_all on public.workflow_templates for all using (tenant_id = public.current_tenant_id() and public.is_staff()) with check (tenant_id = public.current_tenant_id() and public.is_staff());

insert into public.tenants (id, name, country_code, currency_code)
values ('00000000-0000-4000-8000-000000000001', 'Kingston Legal Chambers', 'JM', 'JMD')
on conflict do nothing;
