-- Migration 010: Admin RPC to read portal PINs
create or replace function get_portal_pins()
returns table (role text, pin text)
language sql security definer set search_path = public as
$$
  select role, pin from portal_pins order by role;
$$;

-- Ensure anon can call all portal RPCs
grant execute on function get_portal_pins()                    to anon;
grant execute on function validate_consultant_pin(text)        to anon;
grant execute on function validate_admin_pin(text)             to anon;
grant execute on function validate_onboarding_access(uuid, text) to anon;
