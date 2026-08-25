import { serveDiaryObject } from "../../../../server/diary-media.js";
import { isSupportedDiaryId } from "../../../../server/diary-store.js";

export async function onRequestGet({ request, env, params }) {
  if (!env.VISITOR_DB || !env.DIARY_MEDIA) {
    return new Response("Diary unavailable", { status: 503 });
  }

  const id = String(params.id ?? "");
  if (!isSupportedDiaryId(id)) return new Response("Not found", { status: 404 });

  const post = await env.VISITOR_DB.prepare(
    "SELECT audio_key, audio_type FROM diary_posts WHERE id = ? AND status = ? AND audio_key IS NOT NULL",
  )
    .bind(id, "published")
    .first();

  if (!post) return new Response("Not found", { status: 404 });
  return serveDiaryObject(request, env.DIARY_MEDIA, post.audio_key, post.audio_type);
}
