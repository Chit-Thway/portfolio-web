import assert from "node:assert/strict";
import test from "node:test";

import { onRequestPost as login } from "../functions/api/diary/login.js";
import { onRequestGet as session } from "../functions/api/diary/session.js";
import {
  onRequestGet as listPosts,
  onRequestPost as publishPost,
} from "../functions/api/diary/posts.js";
import { onRequestDelete as deletePost } from "../functions/api/diary/posts/[id].js";
import { onRequestGet as getMedia } from "../functions/api/diary/media/[id].js";

class FakeStatement {
  constructor(database, query) {
    this.database = database;
    this.query = query.replace(/\s+/gu, " ").trim();
    this.args = [];
  }

  bind(...args) {
    this.args = args;
    return this;
  }

  async first() {
    if (this.query.startsWith("SELECT window_started_at")) {
      return this.database.attempts.get(this.args[0]) ?? null;
    }

    if (this.query.startsWith("SELECT audio_key FROM diary_posts")) {
      const post = this.database.posts.get(this.args[0]);
      if (!post || !this.args.slice(1).includes(post.status)) return null;
      return { audio_key: post.audio_key };
    }

    if (this.query.startsWith("SELECT media.media_key, media.media_type")) {
      const post = this.database.posts.get(this.args[0]);
      const media = this.database.media.get(`${this.args[0]}:${this.args[1]}`);
      if (!post || !media || post.status !== this.args[2]) return null;
      return { media_key: media.media_key, media_type: media.media_type };
    }

    if (this.query.startsWith("SELECT audio_key, audio_type FROM diary_posts")) {
      const post = this.database.posts.get(this.args[0]);
      if (!post || post.status !== this.args[1] || !post.audio_key) return null;
      return { audio_key: post.audio_key, audio_type: post.audio_type };
    }

    throw new Error("Unsupported first query: " + this.query);
  }

  async all() {
    if (this.query.startsWith("SELECT id, caption, alt_text")) {
      const status = this.args[0];
      const results = [...this.database.posts.values()]
        .filter((post) => post.status === status)
        .sort((left, right) => right.published_at.localeCompare(left.published_at));
      return { results };
    }

    if (this.query.startsWith("SELECT post_id, position, media_type, alt_text")) {
      const postIds = new Set(this.args);
      const results = [...this.database.media.values()]
        .filter((item) => postIds.has(item.post_id))
        .sort((left, right) =>
          left.post_id.localeCompare(right.post_id) || left.position - right.position,
        );
      return { results };
    }

    if (this.query.startsWith("SELECT media_key FROM diary_post_media")) {
      return {
        results: [...this.database.media.values()]
          .filter((item) => item.post_id === this.args[0])
          .sort((left, right) => left.position - right.position)
          .map((item) => ({ media_key: item.media_key })),
      };
    }

    throw new Error("Unsupported all query: " + this.query);
  }

  async run() {
    if (this.query.startsWith("INSERT INTO diary_login_attempts")) {
      this.database.attempts.set(this.args[0], {
        window_started_at: this.args[1],
        attempt_count: this.args[2],
        blocked_until: this.args[3],
      });
      return { success: true };
    }

    if (this.query.startsWith("DELETE FROM diary_login_attempts")) {
      if (this.query.includes("window_started_at <")) {
        const cutoff = this.args[0];
        for (const [key, attempt] of this.database.attempts) {
          if (attempt.window_started_at < cutoff) this.database.attempts.delete(key);
        }
        return { success: true };
      }

      this.database.attempts.delete(this.args[0]);
      return { success: true };
    }

    if (this.query.startsWith("INSERT INTO diary_posts")) {
      const [
        id,
        caption,
        altText,
        location,
        mediaKey,
        mediaType,
        mediaSize,
        audioKey,
        audioType,
        audioTitle,
        status,
        publishedAt,
        createdAt,
        updatedAt,
      ] = this.args;

      this.database.posts.set(id, {
        id,
        caption,
        alt_text: altText,
        location,
        media_key: mediaKey,
        media_type: mediaType,
        media_size: mediaSize,
        audio_key: audioKey,
        audio_type: audioType,
        audio_title: audioTitle,
        status,
        published_at: publishedAt,
        created_at: createdAt,
        updated_at: updatedAt,
      });
      return { success: true };
    }

    if (this.query.startsWith("INSERT INTO diary_post_media")) {
      const [postId, position, mediaKey, mediaType, mediaSize, altText] = this.args;
      this.database.media.set(`${postId}:${position}`, {
        post_id: postId,
        position,
        media_key: mediaKey,
        media_type: mediaType,
        media_size: mediaSize,
        alt_text: altText,
      });
      return { success: true };
    }

    if (this.query.startsWith("UPDATE diary_posts SET status")) {
      const post = this.database.posts.get(this.args[2]);
      if (post) {
        post.status = this.args[0];
        post.updated_at = this.args[1];
      }
      return { success: true };
    }

    if (this.query.startsWith("DELETE FROM diary_posts")) {
      this.database.posts.delete(this.args[0]);
      return { success: true };
    }

    if (this.query.startsWith("DELETE FROM diary_post_media")) {
      for (const [key, item] of this.database.media) {
        if (item.post_id === this.args[0]) this.database.media.delete(key);
      }
      return { success: true };
    }

    throw new Error("Unsupported run query: " + this.query);
  }
}

class FakeD1 {
  constructor() {
    this.attempts = new Map();
    this.posts = new Map();
    this.media = new Map();
  }

  prepare(query) {
    return new FakeStatement(this, query);
  }

  async batch(statements) {
    return Promise.all(statements.map((statement) => statement.run()));
  }
}

class FakeR2 {
  constructor() {
    this.objects = new Map();
  }

  async put(key, value, options = {}) {
    const bytes = new Uint8Array(value);
    this.objects.set(key, {
      bytes,
      contentType: options.httpMetadata?.contentType ?? "application/octet-stream",
      etag: "etag-" + key,
    });
  }

  async head(key) {
    const object = this.objects.get(key);
    if (!object) return null;
    return {
      size: object.bytes.length,
      etag: object.etag,
    };
  }

  async get(key, options = undefined) {
    const object = this.objects.get(key);
    if (!object) return null;

    const bytes = options?.range
      ? object.bytes.slice(
          options.range.offset,
          options.range.offset + options.range.length,
        )
      : object.bytes;

    return {
      body: bytes,
      etag: object.etag,
      writeHttpMetadata(headers) {
        headers.set("Content-Type", object.contentType);
      },
    };
  }

  async delete(key) {
    this.objects.delete(key);
  }
}

function createEnvironment() {
  return {
    VISITOR_DB: new FakeD1(),
    DIARY_MEDIA: new FakeR2(),
    DIARY_ADMIN_PASSWORD: "test-admin-passphrase",
    DIARY_SESSION_SECRET: "test-session-secret-with-at-least-32-characters",
  };
}

function sameOriginRequest(path, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Origin", "http://localhost");
  return new Request("http://localhost" + path, { ...init, headers });
}

test("requires an authenticated session before publishing", async () => {
  const env = createEnvironment();
  const form = new FormData();
  form.set(
    "media",
    new File([new Uint8Array([1])], "photo.jpg", { type: "image/jpeg" }),
  );
  form.set("altText", "Description");

  const response = await publishPost({
    request: sameOriginRequest("/api/diary/posts", {
      method: "POST",
      body: form,
    }),
    env,
  });

  assert.equal(response.status, 401);
  assert.equal(env.VISITOR_DB.posts.size, 0);
  assert.equal(env.DIARY_MEDIA.objects.size, 0);
});

test("signs in, publishes, reads media, and deletes a Diary post", async () => {
  const env = createEnvironment();
  const loginResponse = await login({
    request: sameOriginRequest("/api/diary/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: env.DIARY_ADMIN_PASSWORD }),
    }),
    env,
  });

  assert.equal(loginResponse.status, 200);
  const cookie = loginResponse.headers.get("Set-Cookie")?.split(";")[0];
  assert.ok(cookie);

  const sessionResponse = await session({
    request: new Request("http://localhost/api/diary/session", {
      headers: { Cookie: cookie },
    }),
    env,
  });
  assert.equal((await sessionResponse.json()).authenticated, true);

  const form = new FormData();
  form.set(
    "media",
    new File([new Uint8Array([10, 20, 30, 40])], "photo.jpg", {
      type: "image/jpeg",
    }),
  );
  form.set("altText", "A test photograph.");
  form.append(
    "media",
    new File([new Uint8Array([50, 60, 70])], "clip.webm", {
      type: "video/webm",
    }),
  );
  form.append("altText", "A test video from the same post.");
  form.set("caption", "First real entry.");

  const publishResponse = await publishPost({
    request: sameOriginRequest("/api/diary/posts", {
      method: "POST",
      headers: { Cookie: cookie },
      body: form,
    }),
    env,
  });

  assert.equal(publishResponse.status, 201);
  const published = (await publishResponse.json()).post;
  assert.ok(published.id);
  assert.equal(env.VISITOR_DB.posts.size, 1);
  assert.equal(env.VISITOR_DB.media.size, 2);
  assert.equal(env.DIARY_MEDIA.objects.size, 2);

  const listResponse = await listPosts({ env });
  const listPayload = await listResponse.json();
  assert.equal(listPayload.posts.length, 1);
  assert.equal(listPayload.posts[0].caption, "First real entry.");
  assert.equal(listPayload.posts[0].media.length, 2);

  const mediaResponse = await getMedia({
    request: new Request(
      "http://localhost/api/diary/media/" + encodeURIComponent(published.id),
      { headers: { Range: "bytes=1-2" } },
    ),
    env,
    params: { id: published.id },
  });

  assert.equal(mediaResponse.status, 206);
  assert.equal(mediaResponse.headers.get("Content-Type"), "image/jpeg");
  assert.equal(mediaResponse.headers.get("Content-Range"), "bytes 1-2/4");
  assert.deepEqual(
    new Uint8Array(await mediaResponse.arrayBuffer()),
    new Uint8Array([20, 30]),
  );

  const secondMediaResponse = await getMedia({
    request: new Request(
      "http://localhost/api/diary/media/" +
        encodeURIComponent(published.id) +
        "?index=1",
    ),
    env,
    params: { id: published.id },
  });
  assert.equal(secondMediaResponse.status, 200);
  assert.equal(secondMediaResponse.headers.get("Content-Type"), "video/webm");
  assert.deepEqual(
    new Uint8Array(await secondMediaResponse.arrayBuffer()),
    new Uint8Array([50, 60, 70]),
  );

  const deleteResponse = await deletePost({
    request: sameOriginRequest(
      "/api/diary/posts/" + encodeURIComponent(published.id),
      {
        method: "DELETE",
        headers: { Cookie: cookie },
      },
    ),
    env,
    params: { id: published.id },
  });

  assert.equal(deleteResponse.status, 200);
  assert.equal(env.VISITOR_DB.posts.size, 0);
  assert.equal(env.VISITOR_DB.media.size, 0);
  assert.equal(env.DIARY_MEDIA.objects.size, 0);

  const emptyResponse = await listPosts({ env });
  assert.deepEqual((await emptyResponse.json()).posts, []);
});
