// Edge Function: register-firm
// Creates a new law firm tenant + admin user in one atomic operation.
// Order: tenant → auth user → profile (profile.id = auth user id).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { firmName, fullName, email, password } = await req.json();

    if (!firmName || !fullName || !email || !password) {
      return new Response(JSON.stringify({ error: 'firmName, fullName, email, and password are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // 1. Create tenant
    const { data: tenant, error: tenantErr } = await supabase
      .from('tenants')
      .insert({ name: firmName, country_code: 'JM', currency_code: 'JMD' })
      .select()
      .single();

    if (tenantErr) throw new Error('Failed to create tenant: ' + tenantErr.message);

    // 2. Create auth user FIRST (profile.id must equal auth.uid)
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
      throw new Error('Failed to create auth user: ' + authErr.message);
    }

    const authUserId = authData.user.id;

    // 3. Create profile
    const { error: profileErr } = await supabase
      .from('profiles')
      .insert({ id: authUserId, tenant_id: tenant.id, email, full_name: fullName, role: 'admin' });

    if (profileErr) {
      await supabase.auth.admin.deleteUser(authUserId);
      await supabase.from('tenants').delete().eq('id', tenant.id);
      throw new Error('Failed to create profile: ' + profileErr.message);
    }

    return new Response(
      JSON.stringify({ success: true, tenantId: tenant.id, userId: authUserId }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
