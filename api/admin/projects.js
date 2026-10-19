import { authenticateAdmin } from "../../server/auth.js";
import { db } from "../../server/supabase.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // GET: Fetch projects
  if (req.method === "GET") {
    try {
      if (db) {
        const { data, error } = await db
          .from("portfolio_projects")
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

  // POST: Add project
  if (req.method === "POST") {
    try {
      const { title, techs, github, live, category, short_desc } = body;
      if (!title) return res.status(400).json({ success: false, message: "Project title is required." });

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const technologies = Array.isArray(techs) ? techs : (typeof techs === "string" ? techs.split(",").map(t => t.trim()) : []);

      if (db) {
        const { data, error } = await db.from("portfolio_projects").insert([{
          title,
          slug,
          short_desc: short_desc || "Clean responsive web project.",
          category: category || "frontend",
          technologies,
          github_url: github || "https://github.com/amruthadivvela-droid",
          live_demo_url: live || null,
          is_featured: false,
          is_published: true
        }]).select().single();

        if (error) throw error;
        return res.status(200).json({ success: true, data, message: "Project added successfully! 🌸" });
      }
      return res.status(200).json({ success: true, message: "Recorded project." });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // PUT: Update project
  if (req.method === "PUT") {
    try {
      const { id, live_demo_url, live, github_url, github, is_published, title } = body;
      if (!id) return res.status(400).json({ success: false, message: "Project id is required." });

      if (db) {
        const updates = {};
        if (live !== undefined) updates.live_demo_url = live || null;
        if (live_demo_url !== undefined) updates.live_demo_url = live_demo_url || null;
        if (github !== undefined) updates.github_url = github;
        if (github_url !== undefined) updates.github_url = github_url;
        if (typeof is_published === "boolean") updates.is_published = is_published;
        if (title) updates.title = title;
        updates.updated_at = new Date().toISOString();

        const { data, error } = await db.from("portfolio_projects").update(updates).eq("id", id).select().single();
        if (error) throw error;
        return res.status(200).json({ success: true, data, message: "Project updated successfully! 🌸" });
      }
      return res.status(200).json({ success: true, message: "Updated project." });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // DELETE: Delete project
  if (req.method === "DELETE") {
    try {
      const id = req.query?.id || body.id;
      if (!id) return res.status(400).json({ success: false, message: "Project id is required." });

      if (db) {
        const { error } = await db.from("portfolio_projects").delete().eq("id", id);
        if (error) throw error;
      }
      return res.status(200).json({ success: true, message: "Project removed successfully! 🌸" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed." });
}
