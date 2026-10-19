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
    let content = [];
    if (db) {
      const { data } = await db.from("portfolio_content").select("*").eq("is_published", true);
      content = data || [];
    }

    return res.status(200).json({
      name: "Divvela Jyoti Venkata Amrutha",
      title: "Frontend Developer",
      role: "Chief Technology Officer at CodeXa Agency",
      college: "B.Tech Student, Narasaraopeta Engineering College",
      email: process.env.VITE_PUBLIC_CONTACT_EMAIL || "amruthadivvela@gmail.com",
      whatsapp: process.env.VITE_PUBLIC_WHATSAPP_NUMBER || "919032316792",
      instagram: process.env.VITE_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/amrutha.d344/",
      github: process.env.VITE_PUBLIC_GITHUB_URL || "https://github.com/amruthadivvela-droid",
      content
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
