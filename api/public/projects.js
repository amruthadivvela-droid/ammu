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
        .from("portfolio_projects")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, projects: data });
      }
    }

    // Default fallback
    const fallback = [
      {
        id: "1",
        title: "Smart Classroom Attendance System",
        category: "team",
        technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Web"],
        github_url: "https://github.com/amruthadivvela-droid",
        live_demo_url: null,
        is_featured: true,
        short_desc: "Designed and developed an intuitive, web-based classroom attendance interface."
      },
      {
        id: "2",
        title: "Prompt Tech Showcase",
        category: "frontend",
        technologies: ["HTML5", "CSS3", "JavaScript"],
        github_url: "https://github.com/amruthadivvela-droid",
        live_demo_url: null,
        is_featured: false,
        short_desc: "A modern tech platform interface built for interactive showcase and clean user navigation."
      },
      {
        id: "3",
        title: "Luxury Watch Experience",
        category: "interactive",
        technologies: ["HTML5", "CSS3", "CSS Motion"],
        github_url: "https://github.com/amruthadivvela-droid",
        live_demo_url: null,
        is_featured: false,
        short_desc: "An elegant product showcase page with smooth hover animations and high-fidelity aesthetics."
      }
    ];
    return res.status(200).json({ success: true, projects: fallback });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
