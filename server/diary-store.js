export const MAX_MEDIA_BYTES = 25 * 1024 * 1024;
export const MAX_TOTAL_MEDIA_BYTES = 50 * 1024 * 1024;
export const MAX_MEDIA_ITEMS = 10;
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
  const mediaValues = formData
    .getAll("media")
    .filter((value) => isFileLike(value) && value.size > 0);

  if (mediaValues.length === 0) {
    throw new DiaryValidationError("Choose a photo or short video.");
  }

  if (mediaValues.length > MAX_MEDIA_ITEMS) {
    throw new DiaryValidationError(
      "Choose no more than " + MAX_MEDIA_ITEMS + " photos or videos.",
    );
  }

  const descriptions = formData.getAll("altText");
  const media = mediaValues.map((file, index) => {
    const extension = MEDIA_TYPES.get(file.type);
    if (!extension) {
      throw new DiaryValidationError("Use JPEG, PNG, WebP, GIF, MP4 or WebM files.");
    }

    if (file.size > MAX_MEDIA_BYTES) {
      throw new DiaryValidationError("Each photo or video must be 25 MB or smaller.", 413);
    }

    return {
      file,
      extension,
      altText: normaliseText(
        descriptions[index],
        300,
        "Description for media " + (index + 1),
        { required: true },
      ),
    };
  });

  const totalMediaBytes = media.reduce((total, item) => total + item.file.size, 0);
  if (totalMediaBytes > MAX_TOTAL_MEDIA_BYTES) {
    throw new DiaryValidationError(
      "The combined photos and videos must be 50 MB or smaller.",
      413,
    );
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
    location: normaliseText(formData.get("location"), 100, "Location"),
    audioTitle: audio
      ? normaliseText(audio.name, 120, "Audio file name", { required: true })
      : "",
    media,
    audio,
    audioExtension,
  };
}

export function toPublicDiaryPost(row, mediaRows = []) {
  const media = mediaRows.length > 0
    ? mediaRows.map((item) => ({
        position: Number(item.position),
        mediaType: item.media_type,
        mediaUrl:
          "/api/diary/media/" +
          encodeURIComponent(row.id) +
          "?index=" +
          encodeURIComponent(String(item.position)),
        altText: item.alt_text,
      }))
    : [
        {
          position: 0,
          mediaType: row.media_type,
          mediaUrl: "/api/diary/media/" + encodeURIComponent(row.id),
          altText: row.alt_text,
        },
      ];
  const firstMedia = media[0];

  return {
    id: row.id,
    caption: row.caption,
    altText: firstMedia.altText,
    location: row.location,
    media,
    mediaType: firstMedia.mediaType,
    mediaUrl: firstMedia.mediaUrl,
    audioType: row.audio_type,
    audioTitle: row.audio_title,
    audioUrl: row.audio_key
      ? "/api/diary/audio/" + encodeURIComponent(row.id)
      : null,
    publishedAt: row.published_at,
  };
}

export function mediaObjectKey(id, position, extension) {
  return "posts/" + id + "/media-" + position + "." + extension;
}

export function audioObjectKey(id, extension) {
  return "posts/" + id + "/audio." + extension;
}

export function isSupportedDiaryId(value) {
  return /^[0-9a-f]{8}-[0-9a-f-]{27}$/iu.test(value ?? "");
}
