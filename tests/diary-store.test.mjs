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

  assert.equal(entry.mediaExtension, "jpg");
  assert.equal(entry.altText, "A clearly described personal moment.");
  assert.equal(entry.caption, "A short note.");
  assert.equal(entry.audio, null);
});

test("requires publishing permission and credit for optional audio", () => {
  const form = baseForm();
  form.set(
    "audio",
    new File([new Uint8Array([4, 5, 6])], "sound.mp3", {
      type: "audio/mpeg",
    }),
  );
  form.set("audioTitle", "Original recording");

  assert.throws(
    () => validateDiaryPostForm(form),
    (error) =>
      error instanceof DiaryValidationError &&
      /permission to publish/u.test(error.message),
  );

  form.set("audioPermission", "confirmed");
  const entry = validateDiaryPostForm(form);
  assert.equal(entry.audioExtension, "mp3");
  assert.equal(entry.audioTitle, "Original recording");
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
  const post = toPublicDiaryPost({
    id: "1695ff59-b16f-48b8-a89a-adf666722473",
    caption: "Published",
    alt_text: "Description",
    location: null,
    media_type: "image/jpeg",
    audio_key: "private/audio.mp3",
    audio_type: "audio/mpeg",
    audio_title: "Original",
    published_at: "2026-08-25T00:00:00.000Z",
  });

  assert.equal(
    post.mediaUrl,
    "/api/diary/media/1695ff59-b16f-48b8-a89a-adf666722473",
  );
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
