import { authenticateAdmin } from "../../server/auth.js";
import { db } from "../../server/supabase.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // GET: Fetch skills
  if (req.method === "GET") {
    try {
      if (db) {
        const { data, error } = await db
          .from("portfolio_skills")
          .select("*")
          .order("display_order", { ascending: true });
        if (!error && data) {
          return res.status(200).json({ success: true, data });
        }
      }
      return res.status(200).json({ success: true, data: [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Admin Verification for Mutations
  const session = authenticateAdmin(req);
  if (!session) {
    return res.status(401).json({ success: false, message: "Unauthorized. Admin session required." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

  // POST: Add skill
  if (req.method === "POST") {
    try {
      const { name, category, description, icon_identifier, display_order } = body;
      if (!name) return res.status(400).json({ success: false, message: "Skill name is required." });

      if (db) {
        const { data, error } = await db.from("portfolio_skills").insert([{
          name,
          category: category || "frontend",
          description: description || "",
          icon_identifier: icon_identifier || "code",
          display_order: display_order || 0,
          is_visible: true,
          is_published: true
        }]).select().single();

        if (error) throw error;
        return res.status(200).json({ success: true, data, message: "Skill created successfully! 🌸" });
      }
      return res.status(200).json({ success: true, message: "Recorded skill." });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // PUT: Update / toggle skill
  if (req.method === "PUT") {
    try {
      const { id, is_published, is_visible, name, category, description } = body;
      if (!id) return res.status(400).json({ success: false, message: "Skill id is required." });

      if (db) {
        const updates = {};
        if (typeof is_published === "boolean") updates.is_published = is_published;
        if (typeof is_visible === "boolean") updates.is_visible = is_visible;
        if (name) updates.name = name;
        if (category) updates.category = category;
        if (description !== undefined) updates.description = description;
        updates.updated_at = new Date().toISOString();

        const { data, error } = await db.from("portfolio_skills").update(updates).eq("id", id).select().single();
        if (error) throw error;
        return res.status(200).json({ success: true, data, message: "Skill updated successfully! 🌸" });
      }
      return res.status(200).json({ success: true, message: "Updated skill." });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // DELETE: Delete skill
  if (req.method === "DELETE") {
    try {
      const id = req.query?.id || body.id;
      if (!id) return res.status(400).json({ success: false, message: "Skill id is required." });

      if (db) {
        const { error } = await db.from("portfolio_skills").delete().eq("id", id);
        if (error) throw error;
      }
      return res.status(200).json({ success: true, message: "Skill deleted successfully! 🌸" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed." });
}
