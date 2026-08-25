import {
  isSameOriginRequest,
  readAdminSession,
} from "../../../server/diary-auth.js";
import {
  audioObjectKey,
  DiaryValidationError,
  mediaObjectKey,
  toPublicDiaryPost,
  validateDiaryPostForm,
} from "../../../server/diary-store.js";
import { jsonResponse } from "../../../server/visitor-store.js";

function diaryUnavailable(env, { writing = false } = {}) {
  return !env.VISITOR_DB || (writing && (!env.DIARY_MEDIA || !env.DIARY_SESSION_SECRET));
}

export async function onRequestGet({ env }) {
  if (diaryUnavailable(env)) {
    return jsonResponse({ error: "Diary is not configured.", posts: [] }, { status: 503 });
  }

  const postResult = await env.VISITOR_DB.prepare(
    "SELECT id, caption, alt_text, location, media_type, audio_key, audio_type, audio_title, published_at FROM diary_posts WHERE status = ? ORDER BY published_at DESC, id DESC LIMIT 60",
  )
    .bind("published")
    .all();

  const postIds = postResult.results.map((post) => post.id);
  let mediaRows = [];

  if (postIds.length > 0) {
    const placeholders = postIds.map(() => "?").join(", ");
    const mediaResult = await env.VISITOR_DB.prepare(
      "SELECT post_id, position, media_type, alt_text FROM diary_post_media WHERE post_id IN (" +
        placeholders +
        ") ORDER BY post_id, position",
    )
      .bind(...postIds)
      .all();
    mediaRows = mediaResult.results;
  }

  const mediaByPost = new Map();
  for (const item of mediaRows) {
    const current = mediaByPost.get(item.post_id) ?? [];
    current.push(item);
    mediaByPost.set(item.post_id, current);
  }

  return jsonResponse({
    posts: postResult.results.map((post) =>
      toPublicDiaryPost(post, mediaByPost.get(post.id) ?? []),
    ),
    updatedAt: new Date().toISOString(),
  });
}

export async function onRequestPost({ request, env }) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse({ error: "Same-origin request required." }, { status: 403 });
  }

  if (diaryUnavailable(env, { writing: true })) {
    return jsonResponse({ error: "Diary administration is not configured." }, { status: 503 });
  }

  const session = await readAdminSession(request, env.DIARY_SESSION_SECRET);
  if (!session) {
    return jsonResponse({ error: "Admin sign-in required." }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "Send a valid multipart post." }, { status: 400 });
  }

  let entry;
  try {
    entry = validateDiaryPostForm(formData);
  } catch (error) {
    if (error instanceof DiaryValidationError) {
      return jsonResponse({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const mediaObjects = entry.media.map((item, position) => ({
    ...item,
    position,
    key: mediaObjectKey(id, position, item.extension),
  }));
  const firstMedia = mediaObjects[0];
  const audioKey = entry.audio
    ? audioObjectKey(id, entry.audioExtension)
    : null;

  try {
    await Promise.all(
      mediaObjects.map(async (item) => {
        await env.DIARY_MEDIA.put(item.key, await item.file.arrayBuffer(), {
          httpMetadata: {
            contentType: item.file.type,
            cacheControl: "public, max-age=31536000, immutable",
          },
        });
      }),
    );

    if (entry.audio && audioKey) {
      await env.DIARY_MEDIA.put(audioKey, await entry.audio.arrayBuffer(), {
        httpMetadata: {
          contentType: entry.audio.type,
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    }

    const statements = [
      env.VISITOR_DB.prepare(
        "INSERT INTO diary_posts (id, caption, alt_text, location, media_key, media_type, media_size, audio_key, audio_type, audio_title, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      ).bind(
        id,
        entry.caption,
        firstMedia.altText,
        entry.location || null,
        firstMedia.key,
        firstMedia.file.type,
        firstMedia.file.size,
        audioKey,
        entry.audio?.type ?? null,
        entry.audioTitle || null,
        "published",
        createdAt,
        createdAt,
        createdAt,
      ),
      ...mediaObjects.map((item) =>
        env.VISITOR_DB.prepare(
          "INSERT INTO diary_post_media (post_id, position, media_key, media_type, media_size, alt_text) VALUES (?, ?, ?, ?, ?, ?)",
        ).bind(
          id,
          item.position,
          item.key,
          item.file.type,
          item.file.size,
          item.altText,
        ),
      ),
    ];

    await env.VISITOR_DB.batch(statements);
  } catch (error) {
    await Promise.allSettled(
      [...mediaObjects.map((item) => item.key), audioKey]
        .filter(Boolean)
        .map((key) => env.DIARY_MEDIA.delete(key)),
    );
    throw error;
  }

  return jsonResponse(
    {
      post: toPublicDiaryPost(
        {
          id,
          caption: entry.caption,
          alt_text: firstMedia.altText,
          location: entry.location || null,
          media_type: firstMedia.file.type,
          audio_key: audioKey,
          audio_type: entry.audio?.type ?? null,
          audio_title: entry.audioTitle || null,
          published_at: createdAt,
        },
        mediaObjects.map((item) => ({
          position: item.position,
          media_type: item.file.type,
          alt_text: item.altText,
        })),
      ),
    },
    { status: 201 },
  );
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
