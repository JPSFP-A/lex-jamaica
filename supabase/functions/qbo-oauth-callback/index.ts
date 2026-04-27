import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const realmId = url.searchParams.get("realmId");

  if (!code || !realmId) {
    return Response.json({ error: "Missing QBO authorization code or realmId." }, { status: 400, headers: corsHeaders });
  }

  const clientId = Deno.env.get("QBO_CLIENT_ID");
  const clientSecret = Deno.env.get("QBO_CLIENT_SECRET");
  const redirectUri = Deno.env.get("QBO_REDIRECT_URI");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!clientId || !clientSecret || !redirectUri || !supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: "Missing required QBO or Supabase environment variables." }, { status: 500, headers: corsHeaders });
  }

  const tokenResponse = await fetch("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenJson = await tokenResponse.json();
  if (!tokenResponse.ok) {
    return Response.json({ error: "QBO token exchange failed.", details: tokenJson }, { status: 502, headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Replace this tenant lookup with the authenticated user's tenant during production hardening.
  const tenantId = "00000000-0000-4000-8000-000000000001";
  const expiresAt = new Date(Date.now() + tokenJson.expires_in * 1000).toISOString();
  const refreshExpiresAt = new Date(Date.now() + tokenJson.x_refresh_token_expires_in * 1000).toISOString();

  const { error } = await supabase.from("qbo_connections").upsert({
    tenant_id: tenantId,
    realm_id: realmId,
    environment: Deno.env.get("QBO_ENVIRONMENT") || "sandbox",
    access_token_encrypted: tokenJson.access_token,
    refresh_token_encrypted: tokenJson.refresh_token,
    token_expires_at: expiresAt,
    refresh_token_expires_at: refreshExpiresAt,
    is_active: true,
  }, { onConflict: "tenant_id,realm_id" });

  if (error) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }

  return Response.json({ ok: true, realmId }, { headers: corsHeaders });
});
