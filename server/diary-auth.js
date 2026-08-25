const SECURE_COOKIE_NAME = "__Host-ct_diary_admin";
const LOCAL_COOKIE_NAME = "ct_diary_admin";
const SESSION_VERSION = 1;
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

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

export function isSameOriginRequest(request) {
  const origin = request.headers.get("Origin");
  return origin === new URL(request.url).origin;
}

export async function passwordMatches(candidate, expected) {
  if (typeof candidate !== "string" || typeof expected !== "string") return false;

  const [candidateDigest, expectedDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);

  const left = new Uint8Array(candidateDigest);
  const right = new Uint8Array(expectedDigest);
  let mismatch = left.length ^ right.length;

  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    mismatch |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return mismatch === 0;
}

export async function createAdminSessionCookie(request, secret, now = new Date()) {
  const expiresAt = now.getTime() + SESSION_MAX_AGE_SECONDS * 1000;
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        version: SESSION_VERSION,
        expiresAt,
        nonce: crypto.randomUUID(),
      }),
    ),
  );
  const signature = await sign(payload, secret);
  const secure = new URL(request.url).protocol === "https:";
  const cookieName = secure ? SECURE_COOKIE_NAME : LOCAL_COOKIE_NAME;
  const secureAttribute = secure ? "; Secure" : "";

  return {
    expiresAt: new Date(expiresAt).toISOString(),
    header:
      cookieName +
      "=" +
      payload +
      "." +
      signature +
      "; Path=/; HttpOnly; SameSite=Strict; Max-Age=" +
      SESSION_MAX_AGE_SECONDS +
      secureAttribute,
  };
}

export async function readAdminSession(request, secret, now = new Date()) {
  if (!secret) return null;

  const token =
    readCookie(request, SECURE_COOKIE_NAME) ??
    readCookie(request, LOCAL_COOKIE_NAME);
  if (!token) return null;

  const separator = token.lastIndexOf(".");
  if (separator < 1) return null;

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!(await verify(payload, signature, secret))) return null;

  try {
    const session = JSON.parse(decoder.decode(fromBase64Url(payload)));
    if (
      session.version !== SESSION_VERSION ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= now.getTime() ||
      typeof session.nonce !== "string"
    ) {
      return null;
    }

    return {
      expiresAt: new Date(session.expiresAt).toISOString(),
    };
  } catch {
    return null;
  }
}

export function clearAdminSessionCookies(request) {
  const secure = new URL(request.url).protocol === "https:";
  const secureAttribute = secure ? "; Secure" : "";

  return [
    SECURE_COOKIE_NAME +
      "=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure",
    LOCAL_COOKIE_NAME +
      "=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0" +
      secureAttribute,
  ];
}

export async function hashLoginFingerprint(request, secret) {
  const address =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "local-development";

  return sign("diary-login:" + address, secret);
}
