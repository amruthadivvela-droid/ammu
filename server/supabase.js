import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

export const isSupabaseConfigured = Boolean(
  url &&
  secret &&
  !url.includes("YOUR_PROJECT_REF") &&
  !secret.includes("YOUR_PRIVATE")
);

export const db = isSupabaseConfigured
  ? createClient(url, secret, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null;

/**
 * Persist contact enquiry to Supabase PostgreSQL table 'contact_enquiries'
 * Strictly uses PostgreSQL database storage - NO Supabase Auth.
 */
export async function saveContactEnquiry(enquiry) {
  if (!db) {
    console.log("[Supabase Server] Supabase not fully configured; recorded locally in memory/log:", enquiry.id);
    return { data: enquiry, error: null };
  }

  try {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const recordPayload = {
      idempotency_key: enquiry.idempotencyKey || `idem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      visitor_name: enquiry.name,
      visitor_email: enquiry.email,
      requirements: enquiry.message,
      visiting_card_storage_key: enquiry.cardStorageKey || null,
      visiting_card_url: enquiry.cardUrl || null,
      owner_email_status: enquiry.ownerEmailStatus || "pending",
      visitor_email_status: enquiry.visitorEmailStatus || "pending",
      owner_resend_message_id: enquiry.ownerMessageId || null,
      visitor_resend_message_id: enquiry.visitorMessageId || null,
      whatsapp_handoff_status: "prepared",
      retry_count: 0,
      created_at: new Date().toISOString()
    };

    if (enquiry.id && uuidRegex.test(enquiry.id)) {
      recordPayload.id = enquiry.id;
    }

    const { data, error } = await db
      .from("contact_enquiries")
      .upsert(recordPayload, { onConflict: "idempotency_key" })
      .select()
      .single();

    if (error) {
      console.error("[Supabase Server] Error saving enquiry:", error.message);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (err) {
    console.error("[Supabase Server] Database exception:", err);
    return { data: null, error: err };
  }
}
