import {
  clearAdminSessionCookies,
  isSameOriginRequest,
} from "../../../server/diary-auth.js";
import { jsonResponse } from "../../../server/visitor-store.js";

export async function onRequestPost({ request }) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: "Same-origin request required." }, { status: 403 });
  }

  const headers = new Headers();
  for (const cookie of clearAdminSessionCookies(request)) {
    headers.append("Set-Cookie", cookie);
  }

  return jsonResponse({ authenticated: false }, { headers });
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
