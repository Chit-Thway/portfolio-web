import {
  createVisitorCookie,
  getPerthWeekStart,
  hashVisitorIdentifier,
  jsonResponse,
  readVisitorIdentifier,
  shiftDate,
} from "../../server/visitor-store.js";

export async function onRequestPost({ request, env }) {
  const requestUrl = new URL(request.url);
  const requestOrigin = request.headers.get("Origin");

  if (requestOrigin !== requestUrl.origin) {
    return jsonResponse({ error: "Same-origin request required." }, { status: 403 });
  }

  if (!env.VISITOR_DB || !env.VISITOR_TOKEN_SECRET) {
    return jsonResponse({ error: "Visitor counter unavailable." }, { status: 503 });
  }

  let identifier = await readVisitorIdentifier(request, env.VISITOR_TOKEN_SECRET);
  let cookieHeader;

  if (!identifier) {
    const visitorCookie = await createVisitorCookie(env.VISITOR_TOKEN_SECRET);
    identifier = visitorCookie.identifier;
    cookieHeader = visitorCookie.header;
  }

  const weekStart = getPerthWeekStart();
  const visitorHash = await hashVisitorIdentifier(identifier, env.VISITOR_TOKEN_SECRET);
  const retentionCutoff = shiftDate(weekStart, -84);

  await env.VISITOR_DB.batch([
    env.VISITOR_DB.prepare(
      "INSERT OR IGNORE INTO weekly_visitors (week_start, visitor_hash, first_seen_at) VALUES (?, ?, ?)",
    ).bind(weekStart, visitorHash, new Date().toISOString()),
    env.VISITOR_DB.prepare(
      "DELETE FROM weekly_visitors WHERE week_start < ?",
    ).bind(retentionCutoff),
  ]);

  const headers = cookieHeader ? { "Set-Cookie": cookieHeader } : undefined;
  return jsonResponse({ counted: true, weekStart }, { headers });
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
