const COOKIE_NAME = "__Host-ct_portfolio_visitor";
const PERTH_OFFSET_MS = 8 * 60 * 60 * 1000;
const COOKIE_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;
const encoder = new TextEncoder();

function toBase64Url(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

function fromBase64Url(value) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function importHmacKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(value, secret) {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

async function verify(value, signature, secret) {
  try {
    const key = await importHmacKey(secret);
    return crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      encoder.encode(value),
    );
  } catch {
    return false;
  }
}

function readCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") ?? "";
  for (const cookie of cookieHeader.split(";")) {
    const [cookieName, ...valueParts] = cookie.trim().split("=");
    if (cookieName === name) return valueParts.join("=");
  }
  return null;
}

export async function readVisitorIdentifier(request, secret) {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return null;

  const separator = token.lastIndexOf(".");
  if (separator < 1) return null;

  const identifier = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const validIdentifier = /^[0-9a-f]{8}-[0-9a-f-]{27}$/iu.test(identifier);

  if (!validIdentifier || !(await verify(identifier, signature, secret))) return null;
  return identifier;
}

export async function createVisitorCookie(secret) {
  const identifier = crypto.randomUUID();
  const signature = await sign(identifier, secret);

  return {
    identifier,
    header: `${COOKIE_NAME}=${identifier}.${signature}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
  };
}

export async function hashVisitorIdentifier(identifier, secret) {
  return sign(`weekly-visitor:${identifier}`, secret);
}

export function getPerthDate(date = new Date()) {
  return new Date(date.getTime() + PERTH_OFFSET_MS).toISOString().slice(0, 10);
}

export function shiftDate(dateString, days) {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getPerthWeekStart(date = new Date()) {
  const perthDate = new Date(date.getTime() + PERTH_OFFSET_MS);
  const daysSinceMonday = (perthDate.getUTCDay() + 6) % 7;
  perthDate.setUTCDate(perthDate.getUTCDate() - daysSinceMonday);
  return perthDate.toISOString().slice(0, 10);
}

export function jsonResponse(payload, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(JSON.stringify(payload), { ...init, headers });
}
