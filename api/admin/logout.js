import { buildLogoutCookie } from "../../server/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  const isHttps = req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
  res.setHeader("Set-Cookie", buildLogoutCookie(isHttps));
  return res.status(200).json({ success: true, message: "Logged out successfully." });
}
