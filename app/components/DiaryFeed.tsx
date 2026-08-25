"use client";

/* eslint-disable @next/next/no-img-element, jsx-a11y/media-has-caption -- runtime media uses required written descriptions; timed caption files are not part of this milestone */
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "../diary/diary.module.css";

type DiaryMediaItem = {
  position: number;
  mediaType: string;
  mediaUrl: string;
  altText: string;
};

type DiaryPost = {
  id: string;
  caption: string;
  altText: string;
  location: string | null;
  media: DiaryMediaItem[];
  mediaType: string;
  mediaUrl: string;
  audioType: string | null;
  audioTitle: string | null;
  audioUrl: string | null;
  publishedAt: string;
};

type DiaryResponse = {
  posts?: DiaryPost[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className={styles.speakerBody} d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path className={styles.speakerWave} d="M16 8.2a5 5 0 0 1 0 7.6" />
      {muted ? <path className={styles.muteSlash} d="M5 4 19 20" /> : null}
    </svg>
  );
}

function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  duration: number,
  onComplete?: () => void,
) {
  const initial = audio.volume;
  const startedAt = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    audio.volume = Math.min(1, Math.max(0, initial + (target - initial) * progress));

    if (progress < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

function DiaryMedia({ item }: { item: DiaryMediaItem }) {
  if (item.mediaType.startsWith("video/")) {
    return (
      <video
        className={styles.carouselMedia}
        controls
        playsInline
        preload="metadata"
        aria-label={item.altText}
      >
        <source src={item.mediaUrl} type={item.mediaType} />
      </video>
    );
  }

  return (
    <img
      className={styles.carouselMedia}
      src={item.mediaUrl}
      alt={item.altText}
      loading="lazy"
    />
  );
}

function DiaryCarousel({
  post,
  muted,
  onToggleMuted,
}: {
  post: DiaryPost;
  muted: boolean;
  onToggleMuted: () => void;
}) {
  const items = post.media?.length
    ? post.media
    : [
        {
          position: 0,
          mediaType: post.mediaType,
          mediaUrl: post.mediaUrl,
          altText: post.altText,
        },
      ];
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function move(direction: -1 | 1) {
    setActiveIndex((current) =>
      Math.min(items.length - 1, Math.max(0, current + direction)),
    );
  }

  return (
    <div
      className={styles.carousel}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const distance = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(distance) < 45) return;
        move(distance < 0 ? 1 : -1);
      }}
    >
      <div className={styles.carouselFrame}>
        <DiaryMedia item={items[activeIndex]} />
      </div>

      {items.length > 1 ? (
        <>
          <span className={styles.carouselCount} aria-hidden="true">
            {activeIndex + 1}/{items.length}
          </span>
          {activeIndex > 0 ? (
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowPrevious}`}
              type="button"
              onClick={() => move(-1)}
              aria-label="Show previous media"
            >
              ‹
            </button>
          ) : null}
          {activeIndex < items.length - 1 ? (
            <button
              className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
              type="button"
              onClick={() => move(1)}
              aria-label="Show next media"
            >
              ›
            </button>
          ) : null}
          <div className={styles.carouselDots} aria-label="Choose media item">
            {items.map((item, index) => (
              <button
                key={item.position}
                type="button"
                className={index === activeIndex ? styles.carouselDotActive : undefined}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show media ${index + 1} of ${items.length}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </>
      ) : null}

      {post.audioUrl ? (
        <button
          className={styles.audioToggle}
          type="button"
          onClick={onToggleMuted}
          aria-label={muted ? "Unmute Diary audio" : "Mute Diary audio"}
          aria-pressed={!muted}
        >
          <SpeakerIcon muted={muted} />
        </button>
      ) : null}
    </div>
  );
}

function DiaryAudioTrack({
  post,
  active,
  muted,
  registerAudio,
}: {
  post: DiaryPost;
  active: boolean;
  muted: boolean;
  registerAudio: (id: string, node: HTMLAudioElement | null) => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeRef = useRef(active);
  const mutedRef = useRef(muted);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelFade = useRef<(() => void) | null>(null);

  useEffect(() => {
    activeRef.current = active;
    mutedRef.current = muted;
  }, [active, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (replayTimer.current) clearTimeout(replayTimer.current);
    cancelFade.current?.();

    if (active) {
      audio.muted = muted;
      audio.volume = muted ? 1 : 0;
      transitionTimer.current = setTimeout(() => {
        void audio.play().then(() => {
          if (!mutedRef.current) {
            cancelFade.current = fadeVolume(audio, 1, 260);
          }
        }).catch(() => {
          // Muted autoplay can still be declined by a browser; the sound button retries.
        });
      }, 220);
    } else if (!audio.paused) {
      if (audio.muted) {
        audio.pause();
      } else {
        cancelFade.current = fadeVolume(audio, 0, 180, () => {
          audio.pause();
          audio.volume = 1;
        });
      }
    }

    return () => {
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      if (replayTimer.current) clearTimeout(replayTimer.current);
      cancelFade.current?.();
    };
  }, [active, muted]);

  function replayAfterBreak() {
    const audio = audioRef.current;
    if (!audio || !activeRef.current) return;

    audio.currentTime = 0;
    replayTimer.current = setTimeout(() => {
      if (!activeRef.current) return;
      audio.muted = mutedRef.current;
      audio.volume = mutedRef.current ? 1 : 0;
      void audio.play().then(() => {
        if (!mutedRef.current) {
          cancelFade.current = fadeVolume(audio, 1, 260);
        }
      }).catch(() => {});
    }, 420);
  }

  return (
    <div className={styles.audioAttribution} data-playing={active ? "true" : "false"}>
      <span className={styles.vinylRecord} aria-hidden="true">
        <i />
      </span>
      <span className={styles.audioName}>{post.audioTitle}</span>
      <audio
        ref={(node) => {
          audioRef.current = node;
          registerAudio(post.id, node);
        }}
        preload="metadata"
        onEnded={replayAfterBreak}
        aria-hidden="true"
      >
        <source src={post.audioUrl ?? undefined} type={post.audioType ?? undefined} />
      </audio>
    </div>
  );
}

export function DiaryFeed() {
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [authenticated, setAuthenticated] = useState(false);
  const [muted, setMuted] = useState(true);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const postNodes = useRef(new Map<string, HTMLElement>());
  const audioNodes = useRef(new Map<string, HTMLAudioElement>());

  const registerPost = useCallback((id: string, node: HTMLElement | null) => {
    if (node) postNodes.current.set(id, node);
    else postNodes.current.delete(id);
  }, []);

  const registerAudio = useCallback((id: string, node: HTMLAudioElement | null) => {
    if (node) audioNodes.current.set(id, node);
    else audioNodes.current.delete(id);
  }, []);

  function toggleAudio() {
    const nextMuted = !muted;
    const activeAudio = activePostId
      ? audioNodes.current.get(activePostId)
      : null;

    if (!nextMuted && activeAudio) {
      activeAudio.volume = 0;
      activeAudio.muted = false;
      void activeAudio.play().catch(() => {});
    }

    setMuted(nextMuted);
  }

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
    if (posts.length === 0) {
      return;
    }

    let frame = 0;
    const audioPostIds = new Set(
      posts.filter((post) => Boolean(post.audioUrl)).map((post) => post.id),
    );

    const selectFocusedPost = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      let focusedId: string | null = null;
      let focusedScore = 0;

      for (const [id, node] of postNodes.current) {
        const rect = node.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
        );
        const score = visibleHeight / Math.min(rect.height, viewportHeight);

        if (score > focusedScore) {
          focusedScore = score;
          focusedId = id;
        }
      }

      const nextId = focusedScore >= 0.52 && focusedId && audioPostIds.has(focusedId)
        ? focusedId
        : null;
      setActivePostId((current) => (current === nextId ? current : nextId));
    };

    const scheduleSelection = () => {
      if (!frame) frame = requestAnimationFrame(selectFocusedPost);
    };
    const observer = new IntersectionObserver(scheduleSelection, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    for (const node of postNodes.current.values()) observer.observe(node);
    window.addEventListener("scroll", scheduleSelection, { passive: true });
    window.addEventListener("resize", scheduleSelection);
    scheduleSelection();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleSelection);
      window.removeEventListener("resize", scheduleSelection);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [posts]);

  return (
    <section className={styles.feed} aria-labelledby="latest-diary-posts">
      <div className={styles.feedHeading}>
        <h2 id="latest-diary-posts">Latest entries</h2>
        {authenticated ? (
          <a className={styles.adminShortcut} href="/diary/manage/">
            New post <span aria-hidden="true">＋</span>
          </a>
        ) : null}
      </div>

      {status === "loading" ? (
        <div className={styles.emptyState} aria-live="polite">
          <span aria-hidden="true">···</span>
          <div>
            <strong>Checking the Diary.</strong>
            <p>Looking for the latest published entry.</p>
          </div>
        </div>
      ) : null}

      {status === "unavailable" ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">↻</span>
          <div>
            <strong>The Diary is temporarily unavailable.</strong>
            <p>Please try again in a moment.</p>
          </div>
        </div>
      ) : null}

      {status === "ready" && posts.length === 0 ? (
        <div className={styles.emptyState}>
          <span aria-hidden="true">01</span>
          <div>
            <strong>Nothing published yet.</strong>
            <p>The first moment is still waiting.</p>
          </div>
        </div>
      ) : null}

      {status === "ready" && posts.length > 0 ? (
        <div className={styles.postStream}>
          {posts.map((post) => (
            <article
              className={styles.diaryPost}
              key={post.id}
              ref={(node) => registerPost(post.id, node)}
            >
              <header className={styles.postHeader}>
                <img
                  className={styles.postAvatar}
                  src="/chit-thway-portrait.jpg"
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  {post.location ? <span>{post.location}</span> : null}
                </div>
              </header>

              <DiaryCarousel
                post={post}
                muted={muted}
                onToggleMuted={toggleAudio}
              />

              {post.caption || post.audioUrl ? (
                <div className={styles.postDetails}>
                  {post.caption ? (
                    <p className={styles.postCaption}>
                      <strong>CHIT THWAY</strong> {post.caption}
                    </p>
                  ) : null}
                  {post.audioUrl ? (
                    <DiaryAudioTrack
                      post={post}
                      active={activePostId === post.id}
                      muted={muted}
                      registerAudio={registerAudio}
                    />
                  ) : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
