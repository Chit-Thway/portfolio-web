import { serveDiaryObject } from "../../../../server/diary-media.js";
import { isSupportedDiaryId } from "../../../../server/diary-store.js";

export async function onRequestGet({ request, env, params }) {
  if (!env.VISITOR_DB || !env.DIARY_MEDIA) {
    return new Response("Diary unavailable", { status: 503 });
  }

  const id = String(params.id ?? "");
  if (!isSupportedDiaryId(id)) return new Response("Not found", { status: 404 });

  const requestedIndex = new URL(request.url).searchParams.get("index") ?? "0";
  if (!/^\d+$/u.test(requestedIndex)) {
    return new Response("Not found", { status: 404 });
  }
  const position = Number(requestedIndex);
  if (!Number.isSafeInteger(position) || position < 0 || position > 9) {
    return new Response("Not found", { status: 404 });
  }

  const post = await env.VISITOR_DB.prepare(
    "SELECT media.media_key, media.media_type FROM diary_post_media AS media INNER JOIN diary_posts AS post ON post.id = media.post_id WHERE media.post_id = ? AND media.position = ? AND post.status = ?",
  )
    .bind(id, position, "published")
    .first();

  if (!post) return new Response("Not found", { status: 404 });
  return serveDiaryObject(request, env.DIARY_MEDIA, post.media_key, post.media_type);
}
