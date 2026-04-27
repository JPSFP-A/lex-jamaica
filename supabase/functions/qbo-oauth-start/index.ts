import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientId = Deno.env.get("QBO_CLIENT_ID");
  const redirectUri = Deno.env.get("QBO_REDIRECT_URI");
  const environment = Deno.env.get("QBO_ENVIRONMENT") || "sandbox";

  if (!clientId || !redirectUri) {
    return Response.json({ error: "Missing QBO_CLIENT_ID or QBO_REDIRECT_URI." }, { status: 500, headers: corsHeaders });
  }

  const state = crypto.randomUUID();
  const scope = "com.intuit.quickbooks.accounting openid profile email";
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope,
    redirect_uri: redirectUri,
    state,
  });

  const authUrl = `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;

  return Response.json({ authUrl, state, environment }, { headers: corsHeaders });
});
