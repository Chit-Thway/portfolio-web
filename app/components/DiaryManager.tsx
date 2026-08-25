"use client";

/* eslint-disable @next/next/no-img-element -- diary media is uploaded at runtime */
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "../diary/diary.module.css";

type DiaryPost = {
  id: string;
  caption: string;
  altText: string;
  location: string | null;
  media: Array<{
    position: number;
    mediaType: string;
    mediaUrl: string;
    altText: string;
  }>;
  mediaType: string;
  mediaUrl: string;
  audioTitle: string | null;
  audioUrl: string | null;
  publishedAt: string;
};

type MediaDraft = {
  file: File;
  altText: string;
};

export function DiaryManager() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [media, setMedia] = useState<MediaDraft[]>([]);
  const [audio, setAudio] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [audioPermission, setAudioPermission] = useState(false);
  const [status, setStatus] = useState<"idle" | "publishing">("idle");
  const [message, setMessage] = useState("");

  const previewUrls = useMemo(
    () => media.map((item) => URL.createObjectURL(item.file)),
    [media],
  );

  useEffect(() => {
    return () => {
      for (const previewUrl of previewUrls) URL.revokeObjectURL(previewUrl);
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

  async function publishPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (media.length === 0) {
      setMessage("Choose at least one photo or short video.");
      return;
    }

    setStatus("publishing");
    setMessage("");

    const formData = new FormData();
    for (const item of media) {
      formData.append("media", item.file);
      formData.append("altText", item.altText);
    }
    formData.set("caption", caption);
    formData.set("location", location);

    if (audio) {
      formData.set("audio", audio);
      if (audioPermission) formData.set("audioPermission", "confirmed");
    }

    try {
      const response = await fetch("/api/diary/posts", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        if (response.status === 401) setAuthenticated(false);
        setMessage(payload.error ?? "The post could not be published.");
        setStatus("idle");
        return;
      }

      setMedia([]);
      setAudio(null);
      setCaption("");
      setLocation("");
      setAudioPermission(false);
      setMessage("Published. The new entry is now in the public Diary.");
      setStatus("idle");
      await refreshPosts();
    } catch {
      setMessage("Publishing is unavailable in this preview.");
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
    return (
      <div className={styles.managerState} aria-live="polite">
        Checking the publishing session…
      </div>
    );
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
      <section className={styles.composer} aria-labelledby="new-diary-post">
        <div className={styles.managerSectionHeading}>
          <div>
            <p>Publisher</p>
            <h2 id="new-diary-post">Create a Diary post.</h2>
          </div>
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </div>

        <form onSubmit={publishPost}>
          <div className={styles.uploadField}>
            <label htmlFor="diary-media">Photos or short videos</label>
            <input
              id="diary-media"
              name="media"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              multiple
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                if (selected.length > 10) {
                  setMessage("Choose no more than 10 photos or videos.");
                }
                setMedia(
                  selected.slice(0, 10).map((file) => ({ file, altText: "" })),
                );
              }}
              required
            />
            <small>
              Up to 10 JPEG, PNG, WebP, GIF, MP4 or WebM files · 25 MB each · 50 MB combined
            </small>
          </div>

          {media.length > 0 ? (
            <div className={styles.composerPreviewGrid}>
              {media.map((item, index) => (
                <div className={styles.composerMediaItem} key={`${item.file.name}-${index}`}>
                  <div className={styles.composerPreview}>
                    {item.file.type.startsWith("video/") ? (
                      <video
                        src={previewUrls[index]}
                        controls
                        muted
                        playsInline
                        aria-label={`Selected video ${index + 1} preview`}
                      />
                    ) : (
                      <img src={previewUrls[index]} alt="" />
                    )}
                    <span>{index + 1}</span>
                  </div>
                  <label htmlFor={`diary-alt-text-${index}`}>
                    Description for media {index + 1}
                  </label>
                  <textarea
                    id={`diary-alt-text-${index}`}
                    value={item.altText}
                    onChange={(event) => {
                      const value = event.target.value;
                      setMedia((current) =>
                        current.map((entry, itemIndex) =>
                          itemIndex === index ? { ...entry, altText: value } : entry,
                        ),
                      );
                    }}
                    maxLength={300}
                    rows={3}
                    required
                    placeholder="Describe what is visible for someone who cannot see it."
                  />
                </div>
              ))}
            </div>
          ) : null}

          <label htmlFor="diary-caption">Caption</label>
          <textarea
            id="diary-caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={2200}
            rows={5}
            placeholder="What belongs with this moment?"
          />
          <small>
            For video or audio, include the important spoken content so the post remains
            understandable without sound.
          </small>

          <label htmlFor="diary-location">Location <span>Optional</span></label>
          <input
            id="diary-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            maxLength={100}
            placeholder="Perth, WA"
          />

          <div className={styles.uploadField}>
            <label htmlFor="diary-audio">Audio <span>Optional</span></label>
            <input
              id="diary-audio"
              type="file"
              accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg,audio/webm"
              onChange={(event) => {
                setAudio(event.target.files?.[0] ?? null);
                setAudioPermission(false);
              }}
            />
            <small>MP3, M4A, WAV, OGG or WebM · maximum 12 MB</small>
          </div>

          {audio ? (
            <div className={styles.audioFields}>
              <p className={styles.selectedAudioName}>{audio.name}</p>
              <label className={styles.permissionCheck}>
                <input
                  type="checkbox"
                  checked={audioPermission}
                  onChange={(event) => setAudioPermission(event.target.checked)}
                  required
                />
                <span>I own this audio or have permission to publish it.</span>
              </label>
            </div>
          ) : null}

          <button className={styles.publishButton} type="submit" disabled={status === "publishing"}>
            {status === "publishing" ? "Publishing…" : "Publish entry"}
            <span aria-hidden="true">↑</span>
          </button>
          <p className={styles.formMessage} role="status" aria-live="polite">
            {message}
          </p>
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
                  <video
                    src={post.media?.[0]?.mediaUrl ?? post.mediaUrl}
                    muted
                    playsInline
                    aria-label={post.media?.[0]?.altText ?? post.altText}
                  />
                ) : (
                  <img
                    src={post.media?.[0]?.mediaUrl ?? post.mediaUrl}
                    alt={post.media?.[0]?.altText ?? post.altText}
                    loading="lazy"
                  />
                )}
                <div>
                  <strong>{post.caption || "Untitled moment"}</strong>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-AU")}
                    {(post.media?.length ?? 1) > 1
                      ? ` · ${post.media?.length ?? 1} items`
                      : ""}
                  </span>
                </div>
                <button type="button" onClick={() => deletePost(post)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
