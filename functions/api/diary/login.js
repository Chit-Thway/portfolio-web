import {
  createAdminSessionCookie,
  hashLoginFingerprint,
  isSameOriginRequest,
  passwordMatches,
} from "../../../server/diary-auth.js";
import { jsonResponse } from "../../../server/visitor-store.js";

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function unavailable(env) {
  return !env.VISITOR_DB || !env.DIARY_ADMIN_PASSWORD || !env.DIARY_SESSION_SECRET;
}

export async function onRequestPost({ request, env }) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: "Same-origin request required." }, { status: 403 });
  }

  if (unavailable(env)) {
    return jsonResponse({ error: "Diary administration is not configured." }, { status: 503 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Send a valid sign-in request." }, { status: 400 });
  }

  const password = typeof payload?.password === "string" ? payload.password : "";
  if (!password || password.length > 512) {
    return jsonResponse({ error: "Enter the admin passphrase." }, { status: 400 });
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const retentionCutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  await env.VISITOR_DB.prepare(
    "DELETE FROM diary_login_attempts WHERE window_started_at < ? AND (blocked_until IS NULL OR blocked_until < ?)",
  )
    .bind(retentionCutoff, nowIso)
    .run();

  const fingerprintHash = await hashLoginFingerprint(request, env.DIARY_SESSION_SECRET);
  const attempt = await env.VISITOR_DB.prepare(
    "SELECT window_started_at, attempt_count, blocked_until FROM diary_login_attempts WHERE fingerprint_hash = ?",
  )
    .bind(fingerprintHash)
    .first();

  if (attempt?.blocked_until && new Date(attempt.blocked_until).getTime() > now.getTime()) {
    const retryAfter = Math.max(
      1,
      Math.ceil((new Date(attempt.blocked_until).getTime() - now.getTime()) / 1000),
    );
    return jsonResponse(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const valid = await passwordMatches(password, env.DIARY_ADMIN_PASSWORD);
  if (!valid) {
    const windowStart = attempt?.window_started_at
      ? new Date(attempt.window_started_at)
      : now;
    const activeWindow =
      Number.isFinite(windowStart.getTime()) &&
      now.getTime() - windowStart.getTime() < ATTEMPT_WINDOW_MS;
    const attemptCount = activeWindow ? Number(attempt?.attempt_count ?? 0) + 1 : 1;
    const nextWindowStart = activeWindow ? windowStart.toISOString() : nowIso;
    const blockedUntil =
      attemptCount >= MAX_ATTEMPTS
        ? new Date(now.getTime() + ATTEMPT_WINDOW_MS).toISOString()
        : null;

    await env.VISITOR_DB.prepare(
      "INSERT INTO diary_login_attempts (fingerprint_hash, window_started_at, attempt_count, blocked_until) VALUES (?, ?, ?, ?) ON CONFLICT(fingerprint_hash) DO UPDATE SET window_started_at = excluded.window_started_at, attempt_count = excluded.attempt_count, blocked_until = excluded.blocked_until",
    )
      .bind(fingerprintHash, nextWindowStart, attemptCount, blockedUntil)
      .run();

    return jsonResponse(
      {
        error:
          blockedUntil === null
            ? "That passphrase was not accepted."
            : "Too many attempts. Try again later.",
      },
      {
        status: blockedUntil === null ? 401 : 429,
        headers: blockedUntil === null ? undefined : { "Retry-After": "900" },
      },
    );
  }

  await env.VISITOR_DB.prepare(
    "DELETE FROM diary_login_attempts WHERE fingerprint_hash = ?",
  )
    .bind(fingerprintHash)
    .run();

  const session = await createAdminSessionCookie(request, env.DIARY_SESSION_SECRET, now);
  return jsonResponse(
    { authenticated: true, expiresAt: session.expiresAt },
    { headers: { "Set-Cookie": session.header } },
  );
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
