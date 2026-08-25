import {
  isSameOriginRequest,
  readAdminSession,
} from "../../../../server/diary-auth.js";
import { isSupportedDiaryId } from "../../../../server/diary-store.js";
import { jsonResponse } from "../../../../server/visitor-store.js";

export async function onRequestDelete({ request, env, params }) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: "Same-origin request required." }, { status: 403 });
  }

  if (!env.VISITOR_DB || !env.DIARY_MEDIA || !env.DIARY_SESSION_SECRET) {
    return jsonResponse({ error: "Diary administration is not configured." }, { status: 503 });
  }

  const session = await readAdminSession(request, env.DIARY_SESSION_SECRET);
  if (!session) {
    return jsonResponse({ error: "Admin sign-in required." }, { status: 401 });
  }

  const id = String(params.id ?? "");
  if (!isSupportedDiaryId(id)) {
    return jsonResponse({ error: "Post not found." }, { status: 404 });
  }

  const post = await env.VISITOR_DB.prepare(
    "SELECT media_key, audio_key FROM diary_posts WHERE id = ? AND status IN (?, ?)",
  )
    .bind(id, "published", "deleted")
    .first();

  if (!post) {
    return jsonResponse({ error: "Post not found." }, { status: 404 });
  }

  await env.VISITOR_DB.prepare(
    "UPDATE diary_posts SET status = ?, updated_at = ? WHERE id = ?",
  )
    .bind("deleted", new Date().toISOString(), id)
    .run();

  try {
    await Promise.all(
      [post.media_key, post.audio_key]
        .filter(Boolean)
        .map((key) => env.DIARY_MEDIA.delete(key)),
    );
  } catch {
    return jsonResponse(
      { error: "The post is hidden, but its media cleanup needs to be retried." },
      { status: 503 },
    );
  }

  await env.VISITOR_DB.prepare("DELETE FROM diary_posts WHERE id = ?")
    .bind(id)
    .run();

  return jsonResponse({ deleted: true });
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
