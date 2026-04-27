import { createHmac } from "node:crypto";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const verifierToken = Deno.env.get("QBO_WEBHOOK_VERIFIER_TOKEN");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!verifierToken || !supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: "Missing webhook environment variables." }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("intuit-signature") || "";
  const expected = createHmac("sha256", verifierToken).update(rawBody).digest("base64");

  if (signature !== expected) {
    return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const tenantId = "00000000-0000-4000-8000-000000000001";

  await supabase.from("qbo_sync_jobs").insert({
    tenant_id: tenantId,
    job_type: "full_sync",
    direction: "pull",
    status: "queued",
    metadata: payload,
  });

  return Response.json({ ok: true });
});
