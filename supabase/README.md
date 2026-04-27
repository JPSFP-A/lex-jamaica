# Supabase Backend

This folder contains the backend foundation for the Jamaican legal management platform.

## What Is Included

- PostgreSQL tables for tenants, users, clients, matters, tasks, calendar events, documents, billing, trust accounting, workflow templates, portal messages, and audit events
- Supabase Auth integration through `auth.users` and `public.profiles`
- Row-level security policies for tenant isolation
- Role checks for staff, finance, partners, and administrators
- Conflict-check RPC function
- Trust balance helper function
- Audit event helper function

## Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `migrations/001_initial_legal_management.sql`.
4. Create staff users in Supabase Auth.
5. Add matching rows in `public.profiles` with the same `id` as each Auth user.
6. Copy your project URL and anon public key into the HTML file's `SUPABASE_URL` and `SUPABASE_ANON_KEY` constants.

## Production Notes

- Never expose the Supabase service-role key in browser code.
- Keep all sensitive writes behind row-level security and role checks.
- Use Supabase Storage for documents with private buckets and signed URLs.
- Add MFA in Supabase Auth before production.
- Use database backups and point-in-time recovery.
- Add approval workflows for invoice approval, trust withdrawals, and data exports.

## Suggested Buckets

- `matter-documents`: private
- `client-portal-uploads`: private
- `invoice-pdfs`: private
- `audit-exports`: private

## Value-Added Features To Build Next

- Client portal
- Secure document upload and preview
- Document template generation
- E-signature integration
- Court deadline reminders
- Email and calendar sync
- AI-assisted document summaries
- Conflict search across parties, directors, witnesses, opposing counsel, properties, and companies
- Trust reconciliation dashboard
- Partner approval workflows
- Data protection request workflow

## QuickBooks Online Integration

The `004_qbo_crm_integration.sql` migration adds the database layer for two-way QuickBooks Online sync:

- `qbo_connections`: connected QBO company/realm records
- `qbo_entity_links`: maps local clients/invoices/payments to QBO entity IDs
- `qbo_sync_jobs`: push/pull job history and errors

Starter Supabase Edge Functions are included:

- `qbo-oauth-start`: returns the Intuit OAuth authorization URL
- `qbo-oauth-callback`: exchanges the OAuth code for tokens and stores the QBO connection
- `qbo-sync`: starter push/pull actions for customers, invoices, and payments
- `qbo-webhook`: verifies Intuit webhook signatures and queues pull sync jobs

Set these Supabase function secrets before deploying:

- `QBO_CLIENT_ID`
- `QBO_CLIENT_SECRET`
- `QBO_REDIRECT_URI`
- `QBO_ENVIRONMENT` as `sandbox` or `production`
- `QBO_WEBHOOK_VERIFIER_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Recommended mapping:

- Legal app `clients` -> QBO `Customer`
- Legal app `invoices` -> QBO `Invoice`
- QBO `Payment` -> legal app payment/receipt allocation
- Expense/disbursement categories -> QBO expense accounts/items

Keep trust accounting separate from operating revenue unless reviewed by the firm's accountant.

## CRM Communication Layer

The QBO/CRM migration also adds:

- `client_communications`: emails, SMS, portal messages, calls, letters, WhatsApp notes
- `crm_activities`: follow-ups, calls, meetings, intake, retention, referrals
- `crm_segments`: reusable client groups
- `crm_campaigns`: campaign templates and scheduled outreach

Production communication providers can be added behind Supabase Edge Functions:

- Email: SendGrid, Postmark, Microsoft Graph, or Gmail API
- SMS/WhatsApp: Twilio or another approved provider
- Portal messages: Supabase realtime plus private document storage
