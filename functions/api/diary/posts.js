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

  const result = await env.VISITOR_DB.prepare(
    "SELECT id, caption, alt_text, location, media_type, audio_key, audio_type, audio_title, published_at FROM diary_posts WHERE status = ? ORDER BY published_at DESC, id DESC LIMIT 60",
  )
    .bind("published")
    .all();

  return jsonResponse({
    posts: result.results.map(toPublicDiaryPost),
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
  const mediaKey = mediaObjectKey(id, entry.mediaExtension);
  const audioKey = entry.audio
    ? audioObjectKey(id, entry.audioExtension)
    : null;

  try {
    await env.DIARY_MEDIA.put(mediaKey, await entry.media.arrayBuffer(), {
      httpMetadata: {
        contentType: entry.media.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    if (entry.audio && audioKey) {
      await env.DIARY_MEDIA.put(audioKey, await entry.audio.arrayBuffer(), {
        httpMetadata: {
          contentType: entry.audio.type,
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    }

    await env.VISITOR_DB.prepare(
      "INSERT INTO diary_posts (id, caption, alt_text, location, media_key, media_type, media_size, audio_key, audio_type, audio_title, status, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        id,
        entry.caption,
        entry.altText,
        entry.location || null,
        mediaKey,
        entry.media.type,
        entry.media.size,
        audioKey,
        entry.audio?.type ?? null,
        entry.audioTitle || null,
        "published",
        createdAt,
        createdAt,
        createdAt,
      )
      .run();
  } catch (error) {
    await Promise.allSettled(
      [mediaKey, audioKey].filter(Boolean).map((key) => env.DIARY_MEDIA.delete(key)),
    );
    throw error;
  }

  return jsonResponse(
    {
      post: {
        id,
        caption: entry.caption,
        altText: entry.altText,
        location: entry.location || null,
        mediaType: entry.media.type,
        mediaUrl: "/api/diary/media/" + encodeURIComponent(id),
        audioType: entry.audio?.type ?? null,
        audioTitle: entry.audioTitle || null,
        audioUrl: audioKey
          ? "/api/diary/audio/" + encodeURIComponent(id)
          : null,
        publishedAt: createdAt,
      },
    },
    { status: 201 },
  );
}

export function onRequest() {
  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
