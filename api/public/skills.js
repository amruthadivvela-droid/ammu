import { db } from "../../server/supabase.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    if (db) {
      const { data, error } = await db
        .from("portfolio_skills")
        .select("*")
        .eq("is_published", true)
        .eq("is_visible", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, skills: data });
      }
    }

    // Default fallback
    const fallback = [
      { name: "HTML5", category: "frontend", description: "Semantic, accessible markup", icon_identifier: "code", display_order: 1 },
      { name: "CSS3", category: "frontend", description: "Modern responsive Flexbox & Grid", icon_identifier: "palette", display_order: 2 },
      { name: "JavaScript", category: "frontend", description: "ES6+ interactivity, dynamic DOM, async workflows", icon_identifier: "zap", display_order: 3 },
      { name: "C Language", category: "languages", description: "Core programming fundamentals, problem solving", icon_identifier: "cpu", display_order: 4 },
      { name: "UI & UX Design", category: "workflow", description: "Typographic rhythm & color theory", icon_identifier: "sparkles", display_order: 5 },
      { name: "Responsive Web", category: "workflow", description: "Fluid design across all viewports", icon_identifier: "layout", display_order: 6 }
    ];
    return res.status(200).json({ success: true, skills: fallback });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
