// Edge Function: register-firm
// Creates a new tenant + Supabase auth user + users row atomically.
// Uses service role key so it can bypass RLS.
// CORS is handled here; this function is called unauthenticated.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { firmName, fullName, email, password } = await req.json();

    if (!firmName || !fullName || !email || !password) {
      return json({ error: 'All fields are required' }, 400);
    }

    if (password.length < 8) {
      return json({ error: 'Password must be at least 8 characters' }, 400);
    }

    // Service-role client — can write across RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // 1. Create tenant row
    const { data: tenant, error: tenantErr } = await supabase
      .from('tenants')
      .insert({ name: firmName, country_code: 'JM', currency_code: 'JMD' })
      .select()
      .single();

    if (tenantErr) throw tenantErr;

    // 2. Create users row (our app user record)
    const { data: dbUser, error: dbUserErr } = await supabase
      .from('users')
      .insert({
        tenant_id: tenant.id,
        email,
        full_name: fullName,
        role: 'admin',
        is_active: true,
      })
      .select()
      .single();

    if (dbUserErr) {
      // Rollback tenant
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw dbUserErr;
    }

    // 3. Create Supabase Auth user with tenant_id + role in user_metadata
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // skip email confirmation for demo
      user_metadata: {
        tenant_id: tenant.id,
        user_id: dbUser.id,
        role: 'admin',
        full_name: fullName,
        tenant_name: firmName,
      },
    });

    if (authErr) {
      // Rollback
      await supabase.from('users').delete().eq('id', dbUser.id);
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw authErr;
    }

    // 4. Audit
    await supabase.from('audit_events').insert({
      tenant_id: tenant.id,
      actor_user_id: dbUser.id,
      action: 'register',
      entity_type: 'tenant',
      entity_id: tenant.id,
      metadata: { firm_name: firmName, email },
    });

    return json({ success: true, tenantId: tenant.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('register-firm error:', message);
    return json({ error: message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
