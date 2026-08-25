export const MAX_MEDIA_BYTES = 25 * 1024 * 1024;
export const MAX_AUDIO_BYTES = 12 * 1024 * 1024;

const MEDIA_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["video/mp4", "mp4"],
  ["video/webm", "webm"],
]);

const AUDIO_TYPES = new Map([
  ["audio/mpeg", "mp3"],
  ["audio/mp4", "m4a"],
  ["audio/wav", "wav"],
  ["audio/ogg", "ogg"],
  ["audio/webm", "webm"],
]);

export class DiaryValidationError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "DiaryValidationError";
    this.status = status;
  }
}

function isFileLike(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.arrayBuffer === "function" &&
      typeof value.size === "number" &&
      typeof value.type === "string",
  );
}

function normaliseText(value, maximumLength, fieldName, { required = false } = {}) {
  const text = typeof value === "string" ? value.trim() : "";

  if (required && !text) {
    throw new DiaryValidationError(fieldName + " is required.");
  }

  if (text.length > maximumLength) {
    throw new DiaryValidationError(
      fieldName + " must be " + maximumLength + " characters or fewer.",
    );
  }

  return text;
}

export function validateDiaryPostForm(formData) {
  const media = formData.get("media");
  if (!isFileLike(media) || media.size === 0) {
    throw new DiaryValidationError("Choose a photo or short video.");
  }

  const mediaExtension = MEDIA_TYPES.get(media.type);
  if (!mediaExtension) {
    throw new DiaryValidationError("Use a JPEG, PNG, WebP, GIF, MP4 or WebM file.");
  }

  if (media.size > MAX_MEDIA_BYTES) {
    throw new DiaryValidationError("Photos and videos must be 25 MB or smaller.", 413);
  }

  const audioValue = formData.get("audio");
  const audio = isFileLike(audioValue) && audioValue.size > 0 ? audioValue : null;
  let audioExtension = null;

  if (audio) {
    audioExtension = AUDIO_TYPES.get(audio.type);
    if (!audioExtension) {
      throw new DiaryValidationError("Use an MP3, M4A, WAV, OGG or WebM audio file.");
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      throw new DiaryValidationError("Audio files must be 12 MB or smaller.", 413);
    }

    if (formData.get("audioPermission") !== "confirmed") {
      throw new DiaryValidationError(
        "Confirm that you have permission to publish the selected audio.",
      );
    }
  }

  return {
    caption: normaliseText(formData.get("caption"), 2200, "Caption"),
    altText: normaliseText(formData.get("altText"), 300, "Media description", {
      required: true,
    }),
    location: normaliseText(formData.get("location"), 100, "Location"),
    audioTitle: audio
      ? normaliseText(formData.get("audioTitle"), 120, "Audio credit", {
          required: true,
        })
      : "",
    media,
    mediaExtension,
    audio,
    audioExtension,
  };
}

export function toPublicDiaryPost(row) {
  return {
    id: row.id,
    caption: row.caption,
    altText: row.alt_text,
    location: row.location,
    mediaType: row.media_type,
    mediaUrl: "/api/diary/media/" + encodeURIComponent(row.id),
    audioType: row.audio_type,
    audioTitle: row.audio_title,
    audioUrl: row.audio_key
      ? "/api/diary/audio/" + encodeURIComponent(row.id)
      : null,
    publishedAt: row.published_at,
  };
}

export function mediaObjectKey(id, extension) {
  return "posts/" + id + "/media." + extension;
}

export function audioObjectKey(id, extension) {
  return "posts/" + id + "/audio." + extension;
}

export function isSupportedDiaryId(value) {
  return /^[0-9a-f]{8}-[0-9a-f-]{27}$/iu.test(value ?? "");
}
