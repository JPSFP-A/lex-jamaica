-- Migration 009: Per-client consultant visibility
alter table onboarding_clients
  add column if not exists consultant_visible boolean not null default true;

create index if not exists idx_clients_consultant_visible on onboarding_clients (consultant_visible) where consultant_visible = true;
