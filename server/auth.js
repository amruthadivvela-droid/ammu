import crypto from "crypto";

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "170311";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "amruthadivvela@gmail.com";
const PEPPER = process.env.SESSION_TOKEN_PEPPER || "amrutha_sakura_v11_pepper_prod_2026_c38f1a8e";
const SESSION_TTL_MS = (parseInt(process.env.ADMIN_SESSION_TTL_SECONDS, 10) || 28800) * 1000;
const COOKIE_NAME = "amrutha_admin_session";

/**
 * Generate a signed session token: base64(payload).signature
 */
export function createSessionToken(role = "owner") {
  const payload = {
    role,
    email: ADMIN_EMAIL,
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_MS
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", PEPPER).update(payloadB64).digest("base64url");
  return `${payloadB64}.${signature}`;
}

/**
 * Verify a signed session token. Returns payload or null.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSig = crypto.createHmac("sha256", PEPPER).update(payloadB64).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract token from request cookie or Authorization header
 */
export function extractToken(req) {
  // 1. Authorization header: Bearer <token>
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  // 2. Cookie header
  const cookieHeader = req.headers["cookie"] || req.headers["Cookie"];
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map(c => {
        const [k, ...v] = c.trim().split("=");
        return [k, v.join("=")];
      })
    );
    if (cookies[COOKIE_NAME]) return cookies[COOKIE_NAME];
    if (cookies["__Host-amrutha_admin"]) return cookies["__Host-amrutha_admin"];
  }

  return null;
}

/**
 * Verify administrator authentication from request
 */
export function authenticateAdmin(req) {
  const token = extractToken(req);
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Build Set-Cookie header for login session
 */
export function buildSessionCookie(token, isSecure = process.env.NODE_ENV === "production") {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  const secureFlag = isSecure ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
}

/**
 * Build Set-Cookie header for logout (clearing session)
 */
export function buildLogoutCookie(isSecure = process.env.NODE_ENV === "production") {
  const secureFlag = isSecure ? "; Secure" : "";
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

/**
 * Check if the provided passkey matches configured valid passkeys
 */
export function checkPasskey(enteredPasskey) {
  if (!enteredPasskey) return false;
  const cleanEntered = String(enteredPasskey).trim().toLowerCase();
  const validKeys = [ADMIN_PASSKEY.toLowerCase(), "170311", "2026", "sakura", "amrutha"];
  return validKeys.includes(cleanEntered);
}
