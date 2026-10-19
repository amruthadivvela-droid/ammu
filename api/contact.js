import crypto from "crypto";
import { saveContactEnquiry } from "../server/supabase.js";
import { sendPortfolioEnquiryEmails } from "../server/email.js";

// In-memory rate limiting map for edge/serverless runtime
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS ? parseInt(process.env.CONTACT_RATE_LIMIT_MAX_REQUESTS, 10) : 30;

// Idempotency cache to prevent duplicate processing
const idempotencyCache = new Map();

export default async function handler(req, res) {
  // CORS & Methods
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed. Use POST." });
  }

  try {
    // 1. Client IP Rate Limiting
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded ? forwarded.split(/, /)[0] : req.socket?.remoteAddress || "127.0.0.1";
    const isLocalhost = ip === "127.0.0.1" || ip === "::1" || ip === "::ffff:127.0.0.1";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

    if (now > rateData.resetTime) {
      rateData.count = 0;
      rateData.resetTime = now + RATE_LIMIT_WINDOW_MS;
    }

    if (!isLocalhost && rateData.count >= RATE_LIMIT_MAX) {
      return res.status(429).json({
        message: "Too many enquiries from this network. Please wait a bit before submitting again! ♡"
      });
    }

    // 2. Validate Input Fields
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const message = (body.message || "").trim();
    const cardDataUrl = body.cardDataUrl || null;

    if (!name || name.length > 100) {
      return res.status(400).json({ message: "Please enter your name (up to 100 characters)." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (!message || message.length > 2000) {
      return res.status(400).json({ message: "Please describe your requirements (up to 2000 characters)." });
    }

    // 3. Idempotency Check
    const idempotencyKey = req.headers["idempotency-key"] || body.idempotencyKey || `idem_${crypto.randomUUID()}`;
    if (idempotencyCache.has(idempotencyKey)) {
      console.log(`[Contact API] Returning cached response for idempotency key: ${idempotencyKey}`);
      return res.status(200).json(idempotencyCache.get(idempotencyKey));
    }

    rateData.count += 1;
    rateLimitMap.set(ip, rateData);

    const enquiryId = crypto.randomUUID();

    // 4. Generate Visiting Card Reference & Short-Lived URL
    let cardUrl = body.cardUrl || null;
    let cardStorageKey = null;

    if (!cardUrl) {
      const cardRef = crypto.createHash("sha256").update(`${enquiryId}_${Date.now()}`).digest("hex").slice(0, 16);
      cardStorageKey = `cards/${enquiryId}/${cardRef}.png`;
      const siteUrl = process.env.VITE_SITE_URL || process.env.APP_ORIGIN || "https://ammuxdev.vercel.app";
      cardUrl = `${siteUrl}/visiting-card?id=${enquiryId}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&req=${encodeURIComponent(message.slice(0, 240))}`;
    }

    const enquiry = {
      id: enquiryId,
      idempotencyKey,
      name,
      email,
      message,
      cardStorageKey,
      cardUrl,
      cardDataUrl
    };

    // 5. Send Resend Emails (Owner Notification + Visitor Thank You)
    const emailResults = await sendPortfolioEnquiryEmails(enquiry);

    enquiry.ownerEmailStatus = emailResults.ownerStatus;
    enquiry.visitorEmailStatus = emailResults.visitorStatus;
    enquiry.ownerMessageId = emailResults.ownerMessageId;
    enquiry.visitorMessageId = emailResults.visitorMessageId;

    // 6. Save Record to Supabase PostgreSQL (NO Supabase Auth)
    await saveContactEnquiry(enquiry);

    // 7. Prepare WhatsApp Handoff Message & Destination
    const waPhone = "919032316792";
    const waText = 
`Hi Amrutha! 🌸
I visited your portfolio and would love to connect.

My Name: ${name}
My Requirements:
${message}

My Visiting Card:
${cardUrl}

Looking forward to discussing this with you!`;

    const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;

    const responsePayload = {
      readyForWhatsApp: true,
      whatsappUrl,
      enquiryId,
      ownerEmailStatus: emailResults.ownerStatus,
      visitorEmailStatus: emailResults.visitorStatus
    };

    // Cache idempotency response
    idempotencyCache.set(idempotencyKey, responsePayload);

    return res.status(200).json(responsePayload);

  } catch (error) {
    console.error("[Contact API Exception]", error);
    return res.status(500).json({
      message: "An unexpected error occurred while preparing your enquiry. Please try again! ♡",
      error: error.message
    });
  }
}
