import { db } from "../server/supabase.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const id = req.query?.id;
  if (!id) {
    return res.status(400).json({ success: false, message: "Enquiry ID required." });
  }

  try {
    if (db) {
      const { data, error } = await db
        .from("contact_enquiries")
        .select("id, visitor_name, visitor_email, requirements, visiting_card_url, created_at")
        .eq("id", id)
        .single();

      if (!error && data) {
        return res.status(200).json({
          success: true,
          enquiry: {
            id: data.id,
            name: data.visitor_name,
            email: data.visitor_email,
            message: data.requirements,
            cardUrl: data.visiting_card_url,
            createdAt: data.created_at
          }
        });
      }
    }

    return res.status(404).json({ success: false, message: "Visiting card record not found." });
  } catch (err) {
    console.error("[Visiting Card API Error]", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
