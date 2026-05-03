-- ============================================================
-- Migration 005: Client onboarding checklist portal
-- No RLS auth required — public portal with permissive policies.
-- Items are defined in the HTML; Supabase stores responses,
-- comments, uploads, and consultant completion status.
-- ============================================================

-- Client responses: one row per checklist item
create table if not exists onboarding_responses (
  item_id   text primary key,
  value     text,
  is_complete   boolean not null default false,
  completed_at  timestamptz,
  updated_at    timestamptz not null default now()
);

-- Comment threads: client questions and consultant replies
create table if not exists onboarding_comments (
  id          uuid primary key default gen_random_uuid(),
  item_id     text not null,
  author_type text not null check (author_type in ('client', 'consultant')),
  author_name text not null default 'Anonymous',
  message     text not null,
  created_at  timestamptz not null default now()
);

-- Document uploads linked to checklist items
create table if not exists onboarding_uploads (
  id              uuid primary key default gen_random_uuid(),
  item_id         text not null,
  file_name       text not null,
  storage_key     text not null,
  file_size_bytes bigint,
  uploaded_at     timestamptz not null default now()
);

-- Enable RLS with fully permissive policies (no login required)
alter table onboarding_responses enable row level security;
alter table onboarding_comments  enable row level security;
alter table onboarding_uploads   enable row level security;

create policy "onboarding_responses_public" on onboarding_responses for all using (true) with check (true);
create policy "onboarding_comments_public"  on onboarding_comments  for all using (true) with check (true);
create policy "onboarding_uploads_public"   on onboarding_uploads   for all using (true) with check (true);

-- Index for fast lookups by item
create index idx_onboarding_comments_item on onboarding_comments (item_id, created_at);
create index idx_onboarding_uploads_item  on onboarding_uploads  (item_id);
