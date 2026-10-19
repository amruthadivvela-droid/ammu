import { checkPasskey, createSessionToken, buildSessionCookie } from "../../server/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const passkey = body.passkey || body.pin || body.password || "";

    if (!passkey) {
      return res.status(400).json({ success: false, message: "Please provide your administrator passkey." });
    }

    if (!checkPasskey(passkey)) {
      return res.status(401).json({ success: false, message: "Access denied. Please try again." });
    }

    const token = createSessionToken("owner");
    const isHttps = req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
    const cookie = buildSessionCookie(token, isHttps);

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({
      success: true,
      token,
      user: {
        role: "owner",
        email: process.env.ADMIN_EMAIL || "amruthadivvela@gmail.com"
      },
      message: "Authentication successful. Welcome, Amrutha! 🌸"
    });
  } catch (error) {
    console.error("[Admin Login Error]", error);
    return res.status(500).json({ success: false, message: "Internal server error during authentication." });
  }
}
