"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/media-has-caption -- runtime media uses the required written description; timed caption files are not part of this milestone */
import { useEffect, useRef, useState } from "react";
import styles from "../diary/diary.module.css";

type DiaryPost = {
  id: string;
  caption: string;
  altText: string;
  location: string | null;
  mediaType: string;
  mediaUrl: string;
  audioType: string | null;
  audioTitle: string | null;
  audioUrl: string | null;
  publishedAt: string;
};

type DiaryResponse = {
  posts?: DiaryPost[];
  error?: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function DiaryMedia({
  post,
  detailed = false,
}: {
  post: DiaryPost;
  detailed?: boolean;
}) {
  if (post.mediaType.startsWith("video/")) {
    return (
      <video
        className={detailed ? styles.dialogMedia : styles.gridMedia}
        controls={detailed}
        muted={!detailed}
        playsInline
        preload="metadata"
        aria-label={post.altText}
      >
        <source src={post.mediaUrl} type={post.mediaType} />
      </video>
    );
  }

  return (
    <img
      className={detailed ? styles.dialogMedia : styles.gridMedia}
      src={post.mediaUrl}
      alt={post.altText}
      loading={detailed ? "eager" : "lazy"}
    />
  );
}

export function DiaryFeed() {
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [authenticated, setAuthenticated] = useState(false);
  const [selected, setSelected] = useState<DiaryPost | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDiary() {
      const [postsResult, sessionResult] = await Promise.allSettled([
        fetch("/api/diary/posts", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        }),
        fetch("/api/diary/session", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        }),
      ]);

      if (postsResult.status === "fulfilled" && postsResult.value.ok) {
        const payload = (await postsResult.value.json()) as DiaryResponse;
        setPosts(Array.isArray(payload.posts) ? payload.posts : []);
        setStatus("ready");
      } else if (!controller.signal.aborted) {
        setStatus("unavailable");
      }

      if (sessionResult.status === "fulfilled" && sessionResult.value.ok) {
        const payload = (await sessionResult.value.json()) as {
          authenticated?: boolean;
        };
        setAuthenticated(Boolean(payload.authenticated));
      }
    }

    void loadDiary();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  return (
    <section className={styles.feed} aria-labelledby="latest-diary-posts">
      <div className={styles.sectionHeading}>
        <div>
          <p>Latest entries</p>
          {authenticated ? (
            <a className={styles.adminShortcut} href="/diary/manage/">
              New post <span aria-hidden="true">＋</span>
            </a>
          ) : null}
        </div>
        <h2 id="latest-diary-posts">
          {posts.length > 0 ? "A personal archive, newest first." : "The first post is still waiting."}
        </h2>
      </div>

      {status === "loading" ? (
        <div className={styles.emptyState} aria-live="polite">
          <span aria-hidden="true">···</span>
          <div>
            <strong>Checking the archive.</strong>
            <p>Looking for the latest published entry.</p>
          </div>
        </div>
      ) : null}

      {status === "unavailable" ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">↻</span>
          <div>
            <strong>The archive is offline in this preview.</strong>
            <p>The public page still works; its database connection is not running here.</p>
          </div>
        </div>
      ) : null}

      {status === "ready" && posts.length === 0 ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">01</span>
          <div>
            <strong>Nothing published yet.</strong>
            <p>This space is ready without inventing a placeholder moment.</p>
          </div>
        </div>
      ) : null}

      {status === "ready" && posts.length > 0 ? (
        <div className={styles.postGrid}>
          {posts.map((post) => (
            <button
              key={post.id}
              className={styles.postTile}
              type="button"
              onClick={() => setSelected(post)}
              aria-label={"Open diary post from " + formatDate(post.publishedAt)}
            >
              <DiaryMedia post={post} />
              <span className={styles.postTileOverlay}>
                <span>{formatDate(post.publishedAt)}</span>
                {post.audioUrl ? <span aria-label="Includes audio">♪</span> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <dialog
        ref={dialogRef}
        className={styles.postDialog}
        onClose={() => setSelected(null)}
        aria-labelledby={selected ? "diary-dialog-date" : undefined}
      >
        {selected ? (
          <div className={styles.dialogLayout}>
            <div className={styles.dialogVisual}>
              <DiaryMedia post={selected} detailed />
            </div>
            <article className={styles.dialogCopy}>
              <form method="dialog">
                <button className={styles.dialogClose} type="submit" aria-label="Close diary post">
                  ×
                </button>
              </form>
              <p className={styles.dialogDate} id="diary-dialog-date">
                {formatDate(selected.publishedAt)}
              </p>
              {selected.location ? <p className={styles.dialogLocation}>{selected.location}</p> : null}
              {selected.caption ? <p className={styles.dialogCaption}>{selected.caption}</p> : null}
              {selected.audioUrl ? (
                <div className={styles.dialogAudio}>
                  <span>{selected.audioTitle}</span>
                  <audio controls preload="none">
                    <source src={selected.audioUrl} type={selected.audioType ?? undefined} />
                  </audio>
                </div>
              ) : null}
            </article>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
