import {
  isSameOriginRequest,
  readAdminSession,
} from "../../../../server/diary-auth.js";
import {
  audioObjectKey,
  DiaryValidationError,
  isSupportedDiaryId,
  mediaObjectKey,
  toPublicDiaryPost,
  validateDiaryPostEditForm,
} from "../../../../server/diary-store.js";
import { jsonResponse } from "../../../../server/visitor-store.js";

async function requireAdmin(request, env) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: "Same-origin request required." }, { status: 403 });
  }

  if (!env.VISITOR_DB || !env.DIARY_MEDIA || !env.DIARY_SESSION_SECRET) {
    return jsonResponse({ error: "Diary administration is not configured." }, { status: 503 });
  }

  const session = await readAdminSession(request, env.DIARY_SESSION_SECRET);
  return session
    ? null
    : jsonResponse({ error: "Admin sign-in required." }, { status: 401 });
}

export async function onRequestPatch({ request, env, params }) {
  const accessError = await requireAdmin(request, env);
  if (accessError) return accessError;

  const id = String(params.id ?? "");
  if (!isSupportedDiaryId(id)) {
    return jsonResponse({ error: "Post not found." }, { status: 404 });
  }

  const post = await env.VISITOR_DB.prepare(
    "SELECT id, caption, alt_text, location, media_key, media_type, media_size, audio_key, audio_type, audio_title, published_at FROM diary_posts WHERE id = ? AND status = ?",
  )
    .bind(id, "published")
    .first();
  if (!post) return jsonResponse({ error: "Post not found." }, { status: 404 });

  const mediaResult = await env.VISITOR_DB.prepare(
    "SELECT position, media_key, media_type, media_size, alt_text FROM diary_post_media WHERE post_id = ? ORDER BY position",
  )
    .bind(id)
    .all();

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "Send a valid multipart post." }, { status: 400 });
  }

  let entry;
  try {
    entry = validateDiaryPostEditForm(formData, mediaResult.results);
  } catch (error) {
    if (error instanceof DiaryValidationError) {
      return jsonResponse({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  const uploadedKeys = [];
  const mediaObjects = entry.media.map((item, position) => {
    if (item.kind === "existing") {
      return {
        position,
        key: item.mediaKey,
        mediaType: item.mediaType,
        mediaSize: item.mediaSize,
        altText: item.altText,
        file: null,
      };
    }

    const key = mediaObjectKey(id, "edit-" + crypto.randomUUID(), item.extension);
    uploadedKeys.push(key);
    return {
      position,
      key,
      mediaType: item.file.type,
      mediaSize: item.file.size,
      altText: item.altText,
      file: item.file,
    };
  });
  const firstMedia = mediaObjects[0];

  let audioKey = post.audio_key;
  let audioType = post.audio_type;
  let audioTitle = post.audio_title;
  if (entry.audioAction === "remove") {
    audioKey = null;
    audioType = null;
    audioTitle = null;
  } else if (entry.audioAction === "replace") {
    audioKey = audioObjectKey(id, entry.audioExtension, crypto.randomUUID());
    audioType = entry.audio.type;
    audioTitle = entry.audioTitle;
    uploadedKeys.push(audioKey);
  }

  try {
    await Promise.all(
      mediaObjects
        .filter((item) => item.file)
        .map(async (item) =>
          env.DIARY_MEDIA.put(item.key, await item.file.arrayBuffer(), {
            httpMetadata: {
              contentType: item.mediaType,
              cacheControl: "public, max-age=31536000, immutable",
            },
          }),
        ),
    );

    if (entry.audioAction === "replace" && entry.audio && audioKey) {
      await env.DIARY_MEDIA.put(audioKey, await entry.audio.arrayBuffer(), {
        httpMetadata: {
          contentType: entry.audio.type,
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    }

    const updatedAt = new Date().toISOString();
    await env.VISITOR_DB.batch([
      env.VISITOR_DB.prepare(
        "UPDATE diary_posts SET caption = ?, alt_text = ?, location = ?, media_key = ?, media_type = ?, media_size = ?, audio_key = ?, audio_type = ?, audio_title = ?, updated_at = ? WHERE id = ? AND status = ?",
      ).bind(
        entry.caption,
        firstMedia.altText,
        entry.location || null,
        firstMedia.key,
        firstMedia.mediaType,
        firstMedia.mediaSize,
        audioKey,
        audioType,
        audioTitle,
        updatedAt,
        id,
        "published",
      ),
      env.VISITOR_DB.prepare("DELETE FROM diary_post_media WHERE post_id = ?").bind(id),
      ...mediaObjects.map((item) =>
        env.VISITOR_DB.prepare(
          "INSERT INTO diary_post_media (post_id, position, media_key, media_type, media_size, alt_text) VALUES (?, ?, ?, ?, ?, ?)",
        ).bind(
          id,
          item.position,
          item.key,
          item.mediaType,
          item.mediaSize,
          item.altText,
        ),
      ),
      env.VISITOR_DB.prepare("DELETE FROM diary_post_links WHERE post_id = ?").bind(id),
      ...entry.links.map((url, position) =>
        env.VISITOR_DB.prepare(
          "INSERT INTO diary_post_links (post_id, position, url) VALUES (?, ?, ?)",
        ).bind(id, position, url),
      ),
    ]);
  } catch (error) {
    await Promise.allSettled(uploadedKeys.map((key) => env.DIARY_MEDIA.delete(key)));
    throw error;
  }

  const retainedMediaKeys = new Set(mediaObjects.map((item) => item.key));
  const staleKeys = mediaResult.results
    .map((item) => item.media_key)
    .filter((key) => !retainedMediaKeys.has(key));
  if (post.audio_key && post.audio_key !== audioKey) staleKeys.push(post.audio_key);
  await Promise.allSettled(staleKeys.map((key) => env.DIARY_MEDIA.delete(key)));

  return jsonResponse({
    post: toPublicDiaryPost(
      {
        id,
        caption: entry.caption,
        alt_text: firstMedia.altText,
        location: entry.location || null,
        media_type: firstMedia.mediaType,
        audio_key: audioKey,
        audio_type: audioType,
        audio_title: audioTitle,
        published_at: post.published_at,
      },
      mediaObjects.map((item) => ({
        position: item.position,
        media_type: item.mediaType,
        alt_text: item.altText,
      })),
      entry.links.map((url, position) => ({ position, url })),
    ),
  });
}

export async function onRequestDelete({ request, env, params }) {
  const accessError = await requireAdmin(request, env);
  if (accessError) return accessError;

  const id = String(params.id ?? "");
  if (!isSupportedDiaryId(id)) {
    return jsonResponse({ error: "Post not found." }, { status: 404 });
  }

  const post = await env.VISITOR_DB.prepare(
    "SELECT audio_key FROM diary_posts WHERE id = ? AND status IN (?, ?)",
  )
    .bind(id, "published", "deleted")
    .first();

  if (!post) {
    return jsonResponse({ error: "Post not found." }, { status: 404 });
  }

  const mediaResult = await env.VISITOR_DB.prepare(
    "SELECT media_key FROM diary_post_media WHERE post_id = ? ORDER BY position",
  )
    .bind(id)
    .all();

  await env.VISITOR_DB.prepare(
    "UPDATE diary_posts SET status = ?, updated_at = ? WHERE id = ?",
  )
    .bind("deleted", new Date().toISOString(), id)
    .run();

  try {
    await Promise.all(
      [...mediaResult.results.map((item) => item.media_key), post.audio_key]
        .filter(Boolean)
        .map((key) => env.DIARY_MEDIA.delete(key)),
    );
  } catch {
    return jsonResponse(
      { error: "The post is hidden, but its media cleanup needs to be retried." },
      { status: 503 },
    );
  }

  await env.VISITOR_DB.batch([
    env.VISITOR_DB.prepare("DELETE FROM diary_post_media WHERE post_id = ?").bind(id),
    env.VISITOR_DB.prepare("DELETE FROM diary_post_links WHERE post_id = ?").bind(id),
    env.VISITOR_DB.prepare("DELETE FROM diary_posts WHERE id = ?").bind(id),
  ]);

  return jsonResponse({ deleted: true });
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
