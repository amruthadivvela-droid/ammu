import { authenticateAdmin } from "../../server/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ authenticated: false, message: "Method not allowed. Use GET." });
  }

  try {
    const session = authenticateAdmin(req);
    if (!session) {
      return res.status(401).json({ authenticated: false, message: "Unauthenticated admin session." });
    }

    return res.status(200).json({
      authenticated: true,
      role: session.role || "owner",
      email: session.email || process.env.ADMIN_EMAIL || "amruthadivvela@gmail.com",
      expiresAt: session.exp
    });
  } catch (error) {
    console.error("[Admin Session Error]", error);
    return res.status(500).json({ authenticated: false, message: "Server error verifying session." });
  }
}
