import { readAdminSession } from "../../../server/diary-auth.js";
import { jsonResponse } from "../../../server/visitor-store.js";

export async function onRequestGet({ request, env }) {
  if (!env.DIARY_SESSION_SECRET) {
    return jsonResponse({ authenticated: false, configured: false });
  }

  const session = await readAdminSession(request, env.DIARY_SESSION_SECRET);
  return jsonResponse({
    authenticated: Boolean(session),
    configured: Boolean(env.VISITOR_DB && env.DIARY_MEDIA && env.DIARY_ADMIN_PASSWORD),
    expiresAt: session?.expiresAt ?? null,
  });
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
