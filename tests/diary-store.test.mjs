import assert from "node:assert/strict";
import test from "node:test";

import {
  DiaryValidationError,
  isSupportedDiaryId,
  toPublicDiaryPost,
  validateDiaryPostForm,
} from "../server/diary-store.js";

function baseForm() {
  const form = new FormData();
  form.set(
    "media",
    new File([new Uint8Array([1, 2, 3])], "moment.jpg", {
      type: "image/jpeg",
    }),
  );
  form.set("altText", "A clearly described personal moment.");
  form.set("caption", "A short note.");
  return form;
}

test("accepts a supported Diary photo with required description", () => {
  const entry = validateDiaryPostForm(baseForm());

  assert.equal(entry.media.length, 1);
  assert.equal(entry.media[0].extension, "jpg");
  assert.equal(entry.media[0].altText, "A clearly described personal moment.");
  assert.equal(entry.caption, "A short note.");
  assert.equal(entry.audio, null);
});

test("accepts an ordered multi-media Diary post", () => {
  const form = baseForm();
  form.append(
    "media",
    new File([new Uint8Array([4, 5])], "clip.webm", {
      type: "video/webm",
    }),
  );
  form.append("altText", "A short video from the same moment.");

  const entry = validateDiaryPostForm(form);
  assert.equal(entry.media.length, 2);
  assert.equal(entry.media[1].extension, "webm");
  assert.equal(entry.media[1].altText, "A short video from the same moment.");
});

test("requires publishing permission and keeps the optional audio filename", () => {
  const form = baseForm();
  form.set(
    "audio",
    new File([new Uint8Array([4, 5, 6])], "sound.mp3", {
      type: "audio/mpeg",
    }),
  );
  assert.throws(
    () => validateDiaryPostForm(form),
    (error) =>
      error instanceof DiaryValidationError &&
      /permission to publish/u.test(error.message),
  );

  form.set("audioPermission", "confirmed");
  const entry = validateDiaryPostForm(form);
  assert.equal(entry.audioExtension, "mp3");
  assert.equal(entry.audioTitle, "sound.mp3");
});

test("rejects unsupported media before storage", () => {
  const form = new FormData();
  form.set(
    "media",
    new File([new Uint8Array([1])], "document.pdf", {
      type: "application/pdf",
    }),
  );
  form.set("altText", "A document.");

  assert.throws(
    () => validateDiaryPostForm(form),
    (error) =>
      error instanceof DiaryValidationError &&
      /JPEG, PNG, WebP, GIF, MP4 or WebM/u.test(error.message),
  );
});

test("maps database records to opaque checked media routes", () => {
  const post = toPublicDiaryPost(
    {
      id: "1695ff59-b16f-48b8-a89a-adf666722473",
      caption: "Published",
      alt_text: "Description",
      location: null,
      media_type: "image/jpeg",
      audio_key: "private/audio.mp3",
      audio_type: "audio/mpeg",
      audio_title: "Original",
      published_at: "2026-08-25T00:00:00.000Z",
    },
    [
      {
        position: 0,
        media_type: "image/jpeg",
        alt_text: "Description",
      },
      {
        position: 1,
        media_type: "video/webm",
        alt_text: "Video description",
      },
    ],
  );

  assert.equal(
    post.mediaUrl,
    "/api/diary/media/1695ff59-b16f-48b8-a89a-adf666722473?index=0",
  );
  assert.equal(post.media.length, 2);
  assert.match(post.media[1].mediaUrl, /\?index=1$/u);
  assert.equal(
    post.audioUrl,
    "/api/diary/audio/1695ff59-b16f-48b8-a89a-adf666722473",
  );
  assert.doesNotMatch(JSON.stringify(post), /private\/audio/u);
});

test("accepts only UUID-shaped Diary identifiers", () => {
  assert.equal(
    isSupportedDiaryId("1695ff59-b16f-48b8-a89a-adf666722473"),
    true,
  );
  assert.equal(isSupportedDiaryId("../../secret"), false);
});
