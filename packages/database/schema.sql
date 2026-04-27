-- PostgreSQL starter schema for Kingston Legal Chambers legal management platform.
-- Extend carefully with migrations. Keep tenant_id on every business table.

create extension if not exists pgcrypto;

create table tenants (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    country_code text not null default 'JM',
    currency_code text not null default 'JMD',
    created_at timestamptz not null default now()
);

create table users (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    email text not null,
    password_hash text,
    full_name text not null,
    role text not null check (role in ('admin', 'partner', 'attorney', 'associate', 'paralegal', 'secretary', 'finance', 'client')),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    unique (tenant_id, email)
);

create table clients (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
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
    created_at timestamptz not null default now()
);

create table contacts (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    client_id uuid references clients(id),
    full_name text not null,
    organization text,
    relationship text,
    email text,
    phone text,
    address text,
    created_at timestamptz not null default now()
);

create table matters (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    client_id uuid not null references clients(id),
    matter_number text not null,
    title text not null,
    practice_area text not null,
    status text not null default 'open',
    responsible_attorney_id uuid references users(id),
    parish text,
    court_name text,
    court_file_number text,
    opened_at date not null default current_date,
    closed_at date,
    budget_amount numeric(14,2),
    billing_type text not null default 'hourly',
    created_at timestamptz not null default now(),
    unique (tenant_id, matter_number)
);

create table matter_parties (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    matter_id uuid not null references matters(id),
    contact_id uuid references contacts(id),
    name text not null,
    party_role text not null,
    counsel_name text,
    created_at timestamptz not null default now()
);

create table tasks (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    matter_id uuid references matters(id),
    assigned_to_user_id uuid references users(id),
    title text not null,
    description text,
    priority text not null default 'normal',
    status text not null default 'todo',
    due_at timestamptz,
    completed_at timestamptz,
    created_at timestamptz not null default now()
);

create table calendar_events (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    matter_id uuid references matters(id),
    title text not null,
    location text,
    event_type text not null,
    starts_at timestamptz not null,
    ends_at timestamptz,
    reminder_minutes integer[] not null default array[1440, 60],
    created_at timestamptz not null default now()
);

create table documents (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    matter_id uuid references matters(id),
    client_id uuid references clients(id),
    uploaded_by_user_id uuid references users(id),
    file_name text not null,
    storage_key text not null,
    mime_type text,
    file_size_bytes bigint,
    version_number integer not null default 1,
    confidentiality_level text not null default 'matter_team',
    created_at timestamptz not null default now()
);

create table time_entries (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    matter_id uuid not null references matters(id),
    user_id uuid not null references users(id),
    activity_code text,
    description text not null,
    entry_date date not null,
    duration_minutes integer not null check (duration_minutes > 0),
    hourly_rate numeric(14,2) not null,
    billable boolean not null default true,
    invoice_id uuid,
    created_at timestamptz not null default now()
);

create table invoices (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    client_id uuid not null references clients(id),
    matter_id uuid references matters(id),
    invoice_number text not null,
    status text not null default 'draft',
    currency_code text not null default 'JMD',
    subtotal numeric(14,2) not null default 0,
    tax_amount numeric(14,2) not null default 0,
    total numeric(14,2) not null default 0,
    issued_at date,
    due_at date,
    created_at timestamptz not null default now(),
    unique (tenant_id, invoice_number)
);

create table trust_accounts (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    bank_name text not null,
    account_name text not null,
    account_reference text not null,
    currency_code text not null default 'JMD',
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);

create table trust_transactions (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid not null references tenants(id),
    trust_account_id uuid not null references trust_accounts(id),
    matter_id uuid not null references matters(id),
    transaction_type text not null check (transaction_type in ('deposit', 'withdrawal', 'transfer', 'refund', 'adjustment')),
    amount numeric(14,2) not null check (amount > 0),
    description text not null,
    approval_status text not null default 'pending',
    created_by_user_id uuid not null references users(id),
    approved_by_user_id uuid references users(id),
    transaction_date date not null default current_date,
    created_at timestamptz not null default now()
);

create table audit_events (
    id uuid primary key default gen_random_uuid(),
    tenant_id uuid references tenants(id),
    actor_user_id uuid references users(id),
    action text not null,
    entity_type text not null,
    entity_id uuid,
    ip_address inet,
    user_agent text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index idx_clients_tenant_search on clients using gin (to_tsvector('english', coalesce(display_name, '') || ' ' || coalesce(legal_name, '') || ' ' || coalesce(email, '')));
create index idx_matters_tenant_status on matters (tenant_id, status);
create index idx_tasks_due on tasks (tenant_id, due_at, status);
create index idx_audit_events_entity on audit_events (tenant_id, entity_type, entity_id, created_at);
