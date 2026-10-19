import { authenticateAdmin } from "../../server/auth.js";
import { db } from "../../server/supabase.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  // GET: Fetch published content (or all content for admin)
  if (req.method === "GET") {
    try {
      if (db) {
        const { data, error } = await db.from("portfolio_content").select("*");
        if (!error && data) {
          return res.status(200).json({ success: true, data });
        }
      }
      return res.status(200).json({ success: true, data: [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST: Save content updates (Admin Only)
  if (req.method === "POST") {
    const session = authenticateAdmin(req);
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized. Admin session required." });
    }

    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      
      if (db) {
        // Body may be an object of updates: { heroGreeting, heroTitle, heroSub, aboutKicker, aboutTitle, aboutBody, ... }
        const entries = [
          {
            section_key: "hero",
            title: body.heroTitle || "Frontend Developer",
            subtitle: body.heroSub || "I turn ideas into thoughtful web experiences.",
            body_text: body.heroGreeting || "Hi, I’m Amrutha. A frontend developer with a passion for creative web experiences."
          },
          {
            section_key: "about",
            title: body.aboutTitle || "Curious mind. Creative heart.",
            subtitle: body.aboutKicker || "01 / A LITTLE ABOUT ME",
            body_text: body.aboutBody || "I’m a B.Tech student at Narasaraopeta Engineering College who loves building clean, user-friendly, responsive web interfaces."
          },
          {
            section_key: "intro_greeting",
            title: body.introGreeting || "WELCOME",
            subtitle: body.introSign || "to my world",
            body_text: "Welcome to Amrutha’s creative portfolio universe."
          },
          {
            section_key: "contact",
            title: body.contactPrompt || "What are your requirements?",
            subtitle: body.contactSub || "Tell me a little about what you'd love to create.",
            body_text: "Have an idea, collaboration, or project? Describe what you need and let's connect via WhatsApp or Email."
          }
        ];

        for (const item of entries) {
          await db.from("portfolio_content").upsert(item, { onConflict: "section_key" });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Portfolio content published to Supabase PostgreSQL successfully! 🌸",
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("[Admin Content Error]", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed." });
}
