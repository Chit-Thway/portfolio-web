"use client";

/* eslint-disable @next/next/no-img-element -- diary media is uploaded at runtime */
import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "../diary/diary.module.css";

type DiaryPost = {
  id: string;
  caption: string;
  altText: string;
  location: string | null;
  mediaType: string;
  mediaUrl: string;
  audioTitle: string | null;
  audioUrl: string | null;
  publishedAt: string;
};

export function DiaryManager() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [media, setMedia] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [location, setLocation] = useState("");
  const [audioTitle, setAudioTitle] = useState("");
  const [audioPermission, setAudioPermission] = useState(false);
  const [status, setStatus] = useState<"idle" | "publishing">("idle");
  const [message, setMessage] = useState("");

  const previewUrl = useMemo(() => (media ? URL.createObjectURL(media) : null), [media]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
    if (!media) {
      setMessage("Choose a photo or short video.");
      return;
    }

    setStatus("publishing");
    setMessage("");

    const formData = new FormData();
    formData.set("media", media);
    formData.set("caption", caption);
    formData.set("altText", altText);
    formData.set("location", location);

    if (audio) {
      formData.set("audio", audio);
      formData.set("audioTitle", audioTitle);
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

      setMedia(null);
      setAudio(null);
      setCaption("");
      setAltText("");
      setLocation("");
      setAudioTitle("");
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
            <label htmlFor="diary-media">Photo or short video</label>
            <input
              id="diary-media"
              name="media"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              onChange={(event) => setMedia(event.target.files?.[0] ?? null)}
              required
            />
            <small>JPEG, PNG, WebP, GIF, MP4 or WebM · maximum 25 MB</small>
          </div>

          {previewUrl && media ? (
            <div className={styles.composerPreview}>
              {media.type.startsWith("video/") ? (
                <video src={previewUrl} controls muted playsInline aria-label="Selected video preview" />
              ) : (
                <img src={previewUrl} alt="Selected media preview" />
              )}
            </div>
          ) : null}

          <label htmlFor="diary-alt-text">Media description</label>
          <textarea
            id="diary-alt-text"
            value={altText}
            onChange={(event) => setAltText(event.target.value)}
            maxLength={300}
            rows={3}
            required
            placeholder="Describe what is visible for someone who cannot see the media."
          />

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
              <label htmlFor="diary-audio-title">Audio title or credit</label>
              <input
                id="diary-audio-title"
                value={audioTitle}
                onChange={(event) => setAudioTitle(event.target.value)}
                maxLength={120}
                required
              />
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
                {post.mediaType.startsWith("video/") ? (
                  <video src={post.mediaUrl} muted playsInline aria-label={post.altText} />
                ) : (
                  <img src={post.mediaUrl} alt={post.altText} loading="lazy" />
                )}
                <div>
                  <strong>{post.caption || "Untitled moment"}</strong>
                  <span>{new Date(post.publishedAt).toLocaleDateString("en-AU")}</span>
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
