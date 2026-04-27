import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type SyncRequest = {
  action: "push_customer" | "pull_customers" | "push_invoice" | "pull_invoices" | "pull_payments";
  entityId?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: "Missing Supabase environment variables." }, { status: 500, headers: corsHeaders });
  }

  const body = (await req.json()) as SyncRequest;
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const tenantId = "00000000-0000-4000-8000-000000000001";

  const { data: connection, error: connectionError } = await supabase
    .from("qbo_connections")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("is_active", true)
    .maybeSingle();

  if (connectionError || !connection) {
    return Response.json({ error: "No active QBO connection found." }, { status: 400, headers: corsHeaders });
  }

  const baseUrl = connection.environment === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";

  if (body.action === "push_customer") {
    const { data: client } = await supabase.from("clients").select("*").eq("id", body.entityId).single();
    if (!client) return Response.json({ error: "Client not found." }, { status: 404, headers: corsHeaders });

    const qboResponse = await fetch(`${baseUrl}/v3/company/${connection.realm_id}/customer?minorversion=75`, {
      method: "POST",
      headers: qboHeaders(connection.access_token_encrypted),
      body: JSON.stringify({
        DisplayName: client.display_name,
        PrimaryEmailAddr: client.email ? { Address: client.email } : undefined,
        PrimaryPhone: client.phone ? { FreeFormNumber: client.phone } : undefined,
      }),
    });

    const qboJson = await qboResponse.json();
    await recordJob(supabase, tenantId, "push_customer", "push", "clients", body.entityId, qboResponse.ok, qboJson);
    return Response.json(qboJson, { status: qboResponse.ok ? 200 : 502, headers: corsHeaders });
  }

  if (body.action === "push_invoice") {
    const { data: invoice } = await supabase.from("invoices").select("*").eq("id", body.entityId).single();
    if (!invoice) return Response.json({ error: "Invoice not found." }, { status: 404, headers: corsHeaders });

    // Production should resolve CustomerRef from qbo_entity_links before posting.
    await recordJob(supabase, tenantId, "push_invoice", "push", "invoices", body.entityId, false, {
      message: "Map invoice lines and CustomerRef before enabling live posting.",
    });
    return Response.json({ queued: true, message: "Invoice sync placeholder recorded. Add CustomerRef and line mapping before live posting." }, { headers: corsHeaders });
  }

  if (body.action === "pull_customers" || body.action === "pull_invoices" || body.action === "pull_payments") {
    const entity = body.action === "pull_customers" ? "Customer" : body.action === "pull_invoices" ? "Invoice" : "Payment";
    const qboResponse = await fetch(`${baseUrl}/v3/company/${connection.realm_id}/query?query=${encodeURIComponent(`select * from ${entity}`)}&minorversion=75`, {
      headers: qboHeaders(connection.access_token_encrypted),
    });
    const qboJson = await qboResponse.json();
    await recordJob(supabase, tenantId, body.action.replace("s", "") as SyncRequest["action"], "pull", entity, undefined, qboResponse.ok, qboJson);
    return Response.json(qboJson, { status: qboResponse.ok ? 200 : 502, headers: corsHeaders });
  }

  return Response.json({ error: "Unsupported sync action." }, { status: 400, headers: corsHeaders });
});

function qboHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

async function recordJob(
  supabase: ReturnType<typeof createClient>,
  tenantId: string,
  jobType: string,
  direction: string,
  entityType: string,
  entityId: string | undefined,
  ok: boolean,
  metadata: unknown,
) {
  await supabase.from("qbo_sync_jobs").insert({
    tenant_id: tenantId,
    job_type: jobType,
    direction,
    status: ok ? "succeeded" : "failed",
    entity_type: entityType,
    entity_id: entityId,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    error_message: ok ? null : "QBO sync requires review.",
    metadata,
  });
}
