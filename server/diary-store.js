export const MAX_MEDIA_BYTES = 25 * 1024 * 1024;
export const MAX_TOTAL_MEDIA_BYTES = 50 * 1024 * 1024;
export const MAX_MEDIA_ITEMS = 10;
export const MAX_AUDIO_BYTES = 12 * 1024 * 1024;
export const MAX_LINK_ITEMS = 5;

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

function validateMediaFile(file, altText, index) {
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
    altText: normaliseText(altText, 300, "Description for media " + (index + 1)),
  };
}

function validateAudioFile(formData) {
  const audioValue = formData.get("audio");
  const audio = isFileLike(audioValue) && audioValue.size > 0 ? audioValue : null;
  if (!audio) return null;

  const extension = AUDIO_TYPES.get(audio.type);
  if (!extension) {
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

  return {
    file: audio,
    extension,
    title: normaliseText(audio.name, 120, "Audio file name", { required: true }),
  };
}

export function classifyDiaryLink(value) {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./u, "");
    if (hostname === "github.com" || hostname.endsWith(".github.com")) return "github";
    if (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) {
      return "linkedin";
    }
  } catch {
    return "link";
  }
  return "link";
}

export function validateDiaryLinks(formData) {
  const values = formData
    .getAll("linkUrl")
    .map((value) => normaliseText(value, 500, "Link"))
    .filter(Boolean);

  if (values.length > MAX_LINK_ITEMS) {
    throw new DiaryValidationError("Add no more than " + MAX_LINK_ITEMS + " links.");
  }

  const seen = new Set();
  return values.map((value) => {
    let url;
    try {
      url = new URL(value);
    } catch {
      throw new DiaryValidationError("Links must be complete HTTPS URLs.");
    }

    if (url.protocol !== "https:") {
      throw new DiaryValidationError("Links must be complete HTTPS URLs.");
    }

    const normalized = url.toString();
    if (seen.has(normalized)) {
      throw new DiaryValidationError("Remove duplicate links before publishing.");
    }
    seen.add(normalized);
    return normalized;
  });
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
  const media = mediaValues.map((file, index) =>
    validateMediaFile(file, descriptions[index], index),
  );

  const totalMediaBytes = media.reduce((total, item) => total + item.file.size, 0);
  if (totalMediaBytes > MAX_TOTAL_MEDIA_BYTES) {
    throw new DiaryValidationError(
      "The combined photos and videos must be 50 MB or smaller.",
      413,
    );
  }

  const audio = validateAudioFile(formData);

  return {
    caption: normaliseText(formData.get("caption"), 2200, "Caption"),
    location: normaliseText(formData.get("location"), 100, "Location"),
    links: validateDiaryLinks(formData),
    audioTitle: audio?.title ?? "",
    media,
    audio: audio?.file ?? null,
    audioExtension: audio?.extension ?? null,
  };
}

export function validateDiaryPostEditForm(formData, currentMediaRows) {
  let rawPlan;
  try {
    rawPlan = JSON.parse(String(formData.get("mediaPlan") ?? ""));
  } catch {
    throw new DiaryValidationError("The media edit plan is invalid.");
  }

  if (!Array.isArray(rawPlan) || rawPlan.length === 0) {
    throw new DiaryValidationError("Keep or add at least one photo or short video.");
  }
  if (rawPlan.length > MAX_MEDIA_ITEMS) {
    throw new DiaryValidationError(
      "Choose no more than " + MAX_MEDIA_ITEMS + " photos or videos.",
    );
  }

  const currentByPosition = new Map(
    currentMediaRows.map((item) => [Number(item.position), item]),
  );
  const uploads = formData
    .getAll("media")
    .filter((value) => isFileLike(value) && value.size > 0);
  const usedExisting = new Set();
  const usedUploads = new Set();

  const media = rawPlan.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new DiaryValidationError("The media edit plan is invalid.");
    }

    if (item.kind === "existing") {
      const position = Number(item.position);
      const current = currentByPosition.get(position);
      if (!Number.isInteger(position) || !current || usedExisting.has(position)) {
        throw new DiaryValidationError("The media edit plan references an invalid item.");
      }
      usedExisting.add(position);
      return {
        kind: "existing",
        mediaKey: current.media_key,
        mediaType: current.media_type,
        mediaSize: Number(current.media_size),
        altText: normaliseText(item.altText, 300, "Description for media " + (index + 1)),
      };
    }

    if (item.kind === "new") {
      const uploadIndex = Number(item.uploadIndex);
      const file = uploads[uploadIndex];
      if (!Number.isInteger(uploadIndex) || !file || usedUploads.has(uploadIndex)) {
        throw new DiaryValidationError("The media edit plan references an invalid upload.");
      }
      usedUploads.add(uploadIndex);
      return {
        kind: "new",
        ...validateMediaFile(file, item.altText, index),
      };
    }

    throw new DiaryValidationError("The media edit plan is invalid.");
  });

  if (usedUploads.size !== uploads.length) {
    throw new DiaryValidationError("Every uploaded media item must appear in the post.");
  }

  const totalMediaBytes = media.reduce(
    (total, item) => total + (item.kind === "new" ? item.file.size : item.mediaSize),
    0,
  );
  if (totalMediaBytes > MAX_TOTAL_MEDIA_BYTES) {
    throw new DiaryValidationError(
      "The combined photos and videos must be 50 MB or smaller.",
      413,
    );
  }

  const audioAction = String(formData.get("audioAction") ?? "keep");
  if (!["keep", "remove", "replace"].includes(audioAction)) {
    throw new DiaryValidationError("The audio edit action is invalid.");
  }
  const replacementAudio = audioAction === "replace" ? validateAudioFile(formData) : null;
  if (audioAction === "replace" && !replacementAudio) {
    throw new DiaryValidationError("Choose the replacement audio file.");
  }

  return {
    caption: normaliseText(formData.get("caption"), 2200, "Caption"),
    location: normaliseText(formData.get("location"), 100, "Location"),
    links: validateDiaryLinks(formData),
    media,
    audioAction,
    audio: replacementAudio?.file ?? null,
    audioExtension: replacementAudio?.extension ?? null,
    audioTitle: replacementAudio?.title ?? null,
  };
}

export function toPublicDiaryPost(row, mediaRows = [], linkRows = []) {
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
    links: linkRows.map((item) => ({
      position: Number(item.position),
      url: item.url,
      kind: classifyDiaryLink(item.url),
    })),
    publishedAt: row.published_at,
  };
}

export function mediaObjectKey(id, position, extension) {
  return "posts/" + id + "/media-" + position + "." + extension;
}

export function audioObjectKey(id, extension, token = "") {
  return "posts/" + id + "/audio" + (token ? "-" + token : "") + "." + extension;
}

export function isSupportedDiaryId(value) {
  return /^[0-9a-f]{8}-[0-9a-f-]{27}$/iu.test(value ?? "");
}
