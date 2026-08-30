"use client";

/* eslint-disable @next/next/no-img-element -- diary media is uploaded at runtime */
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "../diary/diary.module.css";

type DiaryMedia = {
  position: number;
  mediaType: string;
  mediaUrl: string;
  altText: string;
};

type DiaryLink = {
  position: number;
  url: string;
  kind: "github" | "linkedin" | "link";
};

type DiaryPost = {
  id: string;
  caption: string;
  altText: string;
  location: string | null;
  media: DiaryMedia[];
  mediaType: string;
  mediaUrl: string;
  audioTitle: string | null;
  audioUrl: string | null;
  links?: DiaryLink[];
  publishedAt: string;
};

type ExistingMediaDraft = {
  kind: "existing";
  id: string;
  originalPosition: number;
  mediaType: string;
  mediaUrl: string;
  altText: string;
};

type NewMediaDraft = {
  kind: "new";
  id: string;
  file: File;
  altText: string;
};

type MediaDraft = ExistingMediaDraft | NewMediaDraft;

function makeNewMedia(files: File[]): NewMediaDraft[] {
  return files.map((file) => ({
    kind: "new",
    id: crypto.randomUUID(),
    file,
    altText: "",
  }));
}

export function DiaryManager() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [editingPost, setEditingPost] = useState<DiaryPost | null>(null);
  const [media, setMedia] = useState<MediaDraft[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const [existingAudioTitle, setExistingAudioTitle] = useState<string | null>(null);
  const [removeAudio, setRemoveAudio] = useState(false);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [audioPermission, setAudioPermission] = useState(false);
  const [status, setStatus] = useState<"idle" | "publishing" | "saving">("idle");
  const [message, setMessage] = useState("");

  const previewUrls = useMemo(
    () =>
      new Map(
        media
          .filter((item): item is NewMediaDraft => item.kind === "new")
          .map((item) => [item.id, URL.createObjectURL(item.file)]),
      ),
    [media],
  );

  useEffect(() => {
    return () => {
      for (const previewUrl of previewUrls.values()) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrls]);

  async function refreshPosts() {
    const response = await fetch("/api/diary/posts", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return;

    const payload = (await response.json()) as { posts?: DiaryPost[] };
    setPosts(Array.isArray(payload.posts) ? payload.posts : []);
  }

  useEffect(() => {
    let active = true;

    async function initialise() {
      try {
        const response = await fetch("/api/diary/session", {
          headers: { Accept: "application/json" },
        });
        const payload = (await response.json()) as { authenticated?: boolean };
        if (!active) return;

        const signedIn = Boolean(payload.authenticated);
        setAuthenticated(signedIn);
        if (signedIn) await refreshPosts();
      } catch {
        if (active) setAuthenticated(false);
      }
    }

    void initialise();
    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setEditingPost(null);
    setMedia([]);
    setAudio(null);
    setExistingAudioTitle(null);
    setRemoveAudio(false);
    setCaption("");
    setLocation("");
    setLinks([]);
    setAudioPermission(false);
  }

  function startEditing(post: DiaryPost) {
    setEditingPost(post);
    setMedia(
      post.media.map((item) => ({
        kind: "existing",
        id: `existing-${item.position}`,
        originalPosition: item.position,
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        altText: item.altText,
      })),
    );
    setAudio(null);
    setExistingAudioTitle(post.audioTitle);
    setRemoveAudio(false);
    setCaption(post.caption);
    setLocation(post.location ?? "");
    setLinks((post.links ?? []).map((link) => link.url));
    setAudioPermission(false);
    setMessage("Editing this post. Its published date will stay unchanged.");
    document.getElementById("diary-composer")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function moveMedia(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= media.length) return;
    setMedia((current) => {
      const reordered = [...current];
      [reordered[index], reordered[nextIndex]] = [
        reordered[nextIndex],
        reordered[index],
      ];
      return reordered;
    });
  }

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (media.length === 0) {
      setMessage("Keep or add at least one photo or short video.");
      return;
    }

    const editing = Boolean(editingPost);
    setStatus(editing ? "saving" : "publishing");
    setMessage("");

    const formData = new FormData();
    formData.set("caption", caption);
    formData.set("location", location);
    for (const link of links) formData.append("linkUrl", link);

    if (editingPost) {
      let uploadIndex = 0;
      const mediaPlan = media.map((item) => {
        if (item.kind === "existing") {
          return {
            kind: "existing",
            position: item.originalPosition,
            altText: item.altText,
          };
        }

        formData.append("media", item.file);
        return {
          kind: "new",
          uploadIndex: uploadIndex++,
          altText: item.altText,
        };
      });
      formData.set("mediaPlan", JSON.stringify(mediaPlan));

      if (audio) formData.set("audioAction", "replace");
      else if (removeAudio) formData.set("audioAction", "remove");
      else formData.set("audioAction", "keep");
    } else {
      for (const item of media) {
        if (item.kind !== "new") continue;
        formData.append("media", item.file);
        formData.append("altText", item.altText);
      }
    }

    if (audio) {
      formData.set("audio", audio);
      if (audioPermission) formData.set("audioPermission", "confirmed");
    }

    try {
      const response = await fetch(
        editingPost
          ? "/api/diary/posts/" + encodeURIComponent(editingPost.id)
          : "/api/diary/posts",
        {
          method: editingPost ? "PATCH" : "POST",
          headers: { Accept: "application/json" },
          body: formData,
        },
      );
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (response.status === 401) setAuthenticated(false);
        setMessage(payload.error ?? "The post could not be saved.");
        setStatus("idle");
        return;
      }

      resetForm();
      setMessage(
        editing
          ? "Saved. The published date stayed unchanged."
          : "Published. The new entry is now in the public Diary.",
      );
      setStatus("idle");
      await refreshPosts();
    } catch {
      setMessage("Saving is unavailable in this preview.");
      setStatus("idle");
    }
  }

  async function deletePost(post: DiaryPost) {
    if (!window.confirm("Delete this Diary post and its uploaded media?")) return;

    const response = await fetch("/api/diary/posts/" + encodeURIComponent(post.id), {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });

    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }

    if (!response.ok) {
      setMessage("The post could not be deleted.");
      return;
    }

    if (editingPost?.id === post.id) resetForm();
    setPosts((current) => current.filter((entry) => entry.id !== post.id));
    setMessage("Post deleted.");
  }

  async function signOut() {
    await fetch("/api/diary/logout", {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    window.location.replace("/diary/");
  }

  if (authenticated === null) {
    return <div className={styles.managerState} aria-live="polite">Checking the publishing session…</div>;
  }

  if (!authenticated) {
    return (
      <div className={styles.managerState}>
        <strong>This workspace needs an admin session.</strong>
        <p>The page is unlisted, but publishing is still protected on the server.</p>
        <a href="/login/">Return to the private entrance</a>
      </div>
    );
  }

  return (
    <div className={styles.managerLayout}>
      <section className={styles.composer} id="diary-composer" aria-labelledby="new-diary-post">
        <div className={styles.managerSectionHeading}>
          <div>
            <p>{editingPost ? "Editor" : "Publisher"}</p>
            <h2 id="new-diary-post">
              {editingPost ? "Edit this Diary post." : "Create a Diary post."}
            </h2>
          </div>
          <div className={styles.managerHeadingActions}>
            {editingPost ? (
              <button type="button" onClick={() => { resetForm(); setMessage("Edit cancelled."); }}>
                Cancel edit
              </button>
            ) : null}
            <button type="button" onClick={signOut}>Sign out</button>
          </div>
        </div>

        <form onSubmit={submitPost}>
          {editingPost ? (
            <p className={styles.fixedDateNotice}>
              Published {new Date(editingPost.publishedAt).toLocaleDateString("en-AU")} · date locked
            </p>
          ) : null}

          <div className={styles.uploadField}>
            <label htmlFor="diary-media">
              {editingPost ? "Add photos or short videos" : "Photos or short videos"}
            </label>
            <input
              id="diary-media"
              name="media"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              multiple
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                const available = Math.max(0, 10 - media.length);
                if (selected.length > available) setMessage("A post can contain no more than 10 photos or videos.");
                setMedia((current) => [...current, ...makeNewMedia(selected.slice(0, available))]);
                event.currentTarget.value = "";
              }}
              required={media.length === 0}
            />
            <small>Up to 10 JPEG, PNG, WebP, GIF, MP4 or WebM files · 25 MB each · 50 MB combined</small>
          </div>

          {media.length > 0 ? (
            <div className={styles.composerPreviewGrid}>
              {media.map((item, index) => {
                const mediaType = item.kind === "new" ? item.file.type : item.mediaType;
                const mediaUrl = item.kind === "new" ? previewUrls.get(item.id) : item.mediaUrl;
                return (
                  <div className={styles.composerMediaItem} key={item.id}>
                    <div className={styles.composerPreview}>
                      {mediaType.startsWith("video/") ? (
                        <video src={mediaUrl} controls muted playsInline aria-label={`Selected video ${index + 1} preview`} />
                      ) : (
                        <img src={mediaUrl} alt="" />
                      )}
                      <span>{index + 1}</span>
                    </div>
                    <div className={styles.mediaEditActions}>
                      <button type="button" onClick={() => moveMedia(index, -1)} disabled={index === 0} aria-label={`Move media ${index + 1} earlier`}>← Earlier</button>
                      <button type="button" onClick={() => moveMedia(index, 1)} disabled={index === media.length - 1} aria-label={`Move media ${index + 1} later`}>Later →</button>
                      <button type="button" className={styles.removeMediaButton} onClick={() => setMedia((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button>
                    </div>
                    <label htmlFor={`diary-alt-text-${item.id}`}>
                      Description for media {index + 1} <span>Optional</span>
                    </label>
                    <textarea
                      id={`diary-alt-text-${item.id}`}
                      value={item.altText}
                      onChange={(event) => {
                        const value = event.target.value;
                        setMedia((current) => current.map((entry) => entry.id === item.id ? { ...entry, altText: value } : entry));
                      }}
                      maxLength={300}
                      rows={3}
                      placeholder="Optional description for accessibility."
                    />
                  </div>
                );
              })}
            </div>
          ) : null}

          <label htmlFor="diary-caption">Caption</label>
          <textarea id="diary-caption" value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={2200} rows={5} placeholder="What belongs with this moment?" />
          <small>For video or audio, include important spoken content when it helps the post make sense without sound.</small>

          <label htmlFor="diary-location">Location <span>Optional</span></label>
          <input id="diary-location" value={location} onChange={(event) => setLocation(event.target.value)} maxLength={100} placeholder="Perth, WA" />

          <div className={styles.linkEditor}>
            <div className={styles.fieldHeading}>
              <p>Links <span>Optional</span></p>
              <button type="button" onClick={() => setLinks((current) => [...current, ""])} disabled={links.length >= 5}>Add link</button>
            </div>
            {links.map((link, index) => (
              <div className={styles.linkInputRow} key={index}>
                <input
                  type="url"
                  value={link}
                  onChange={(event) => {
                    const value = event.target.value;
                    setLinks((current) => current.map((entry, itemIndex) => itemIndex === index ? value : entry));
                  }}
                  maxLength={500}
                  placeholder="https://github.com/... or https://linkedin.com/..."
                  aria-label={`Link ${index + 1}`}
                  required
                />
                <button type="button" onClick={() => setLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove link ${index + 1}`}>Remove</button>
              </div>
            ))}
          </div>

          <div className={styles.uploadField}>
            <label htmlFor="diary-audio">
              {existingAudioTitle && !removeAudio ? "Replace audio" : "Audio"} <span>Optional</span>
            </label>
            <input
              id="diary-audio"
              type="file"
              accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/webm"
              onChange={(event) => {
                setAudio(event.target.files?.[0] ?? null);
                setRemoveAudio(false);
                setAudioPermission(false);
              }}
            />
            <small>MP3, M4A, WAV, OGG or WebM · maximum 12 MB</small>
          </div>

          {existingAudioTitle && !audio ? (
            <div className={styles.existingAudioEditor}>
              <span>{removeAudio ? "Audio will be removed" : existingAudioTitle}</span>
              <button type="button" onClick={() => setRemoveAudio((current) => !current)}>
                {removeAudio ? "Keep audio" : "Remove audio"}
              </button>
            </div>
          ) : null}

          {audio ? (
            <div className={styles.audioFields}>
              <p className={styles.selectedAudioName}>{audio.name}</p>
              <label className={styles.permissionCheck}>
                <input type="checkbox" checked={audioPermission} onChange={(event) => setAudioPermission(event.target.checked)} required />
                <span>I own this audio or have permission to publish it.</span>
              </label>
            </div>
          ) : null}

          <button className={styles.publishButton} type="submit" disabled={status !== "idle"}>
            {status === "publishing" ? "Publishing…" : status === "saving" ? "Saving…" : editingPost ? "Save changes" : "Publish entry"}
            <span aria-hidden="true">↑</span>
          </button>
          <p className={styles.formMessage} role="status" aria-live="polite">{message}</p>
        </form>
      </section>

      <section className={styles.managePosts} aria-labelledby="published-diary-posts">
        <div className={styles.managerSectionHeading}>
          <div>
            <p>Public archive</p>
            <h2 id="published-diary-posts">Published entries.</h2>
          </div>
          <span>{posts.length}</span>
        </div>

        {posts.length === 0 ? (
          <p className={styles.manageEmpty}>No published posts yet.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                {(post.media?.[0]?.mediaType ?? post.mediaType).startsWith("video/") ? (
                  <video src={post.media?.[0]?.mediaUrl ?? post.mediaUrl} muted playsInline aria-label={post.media?.[0]?.altText || "Diary video"} />
                ) : (
                  <img src={post.media?.[0]?.mediaUrl ?? post.mediaUrl} alt={post.media?.[0]?.altText ?? post.altText} loading="lazy" />
                )}
                <div>
                  <strong>{post.caption || "Untitled moment"}</strong>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-AU")}
                    {(post.media?.length ?? 1) > 1 ? ` · ${post.media?.length ?? 1} items` : ""}
                  </span>
                </div>
                <div className={styles.managePostActions}>
                  <button type="button" onClick={() => startEditing(post)}>Edit</button>
                  <button type="button" onClick={() => deletePost(post)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
