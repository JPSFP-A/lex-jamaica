// Edge Function: register-firm
// Creates: Supabase Auth user → tenant → profiles row
// profiles.id must equal auth.users.id, so auth user is created first.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization',
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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // 1. Create tenant
    const { data: tenant, error: tenantErr } = await supabase
      .from('tenants')
      .insert({ name: firmName, country_code: 'JM', currency_code: 'JMD' })
      .select()
      .single();

    if (tenantErr) throw tenantErr;

    // 2. Create Supabase Auth user (profiles.id = auth.uid(), so this comes first)
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        tenant_id:   tenant.id,
        tenant_name: firmName,
        full_name:   fullName,
        role:        'admin',
      },
    });

    if (authErr) {
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw authErr;
    }

    const authUserId = authData.user.id;

    // 3. Create profiles row (id = auth user id)
    const { error: profileErr } = await supabase
      .from('profiles')
      .insert({
        id:        authUserId,
        tenant_id: tenant.id,
        email,
        full_name: fullName,
        role:      'admin',
        is_active: true,
      });

    if (profileErr) {
      await supabase.auth.admin.deleteUser(authUserId);
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw profileErr;
    }

    // 4. Audit
    await supabase.from('audit_events').insert({
      tenant_id:     tenant.id,
      actor_user_id: authUserId,
      action:        'register',
      entity_type:   'tenant',
      entity_id:     tenant.id,
      metadata:      { firm_name: firmName, email },
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
