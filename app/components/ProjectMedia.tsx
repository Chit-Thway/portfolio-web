"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import styles from "./ProjectMedia.module.css";

type ProjectVideoProps = {
  src: string;
  label: string;
  duration: string;
};

export function ProjectVideo({ src, label, duration }: ProjectVideoProps) {
  const captionsSrc = src.replace(/\.mp4(?=$|\?)/i, ".vtt");

  return (
    <figure className={`${styles.media} ${styles.videoFrame}`}>
      <video controls playsInline preload="metadata" aria-label={label}>
        <source src={src} type="video/mp4" />
        <track
          kind="captions"
          src={captionsSrc}
          srcLang="en"
          label="English"
          default
        />
        Your browser does not support embedded video. You can download it from the video controls instead.
      </video>
      <figcaption>
        <span>{label}</span>
        <span>{duration}</span>
      </figcaption>
    </figure>
  );
}

type SlideViewerProps = {
  slides: string[];
  downloadHref: string;
  label: string;
  compact?: boolean;
};

export function SlideViewer({ slides, downloadHref, label, compact = false }: SlideViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStart = useRef<number | null>(null);

  const showPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(slides.length - 1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStart.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStart.current === null) return;
    const end = event.changedTouches[0]?.clientX ?? touchStart.current;
    const distance = end - touchStart.current;
    touchStart.current = null;

    if (Math.abs(distance) < 45) return;
    if (distance > 0) showPrevious();
    else showNext();
  };

  return (
    <section
      className={`${styles.media} ${styles.slideViewer}${
        compact ? ` ${styles.slideViewerCompact}` : ""
      }`}
      data-slide-viewer="true"
      aria-label={`${label} slide viewer`}
    >
      <div className={styles.slideFrame}>
        <button
          className={styles.slideStage}
          type="button"
          onClick={showNext}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label={`Slide ${activeIndex + 1} of ${slides.length}. Show next slide.`}
        >
          <Image
            key={slides[activeIndex]}
            src={slides[activeIndex]}
            alt={`${label}, slide ${activeIndex + 1} of ${slides.length}`}
            width={1600}
            height={900}
            sizes="(max-width: 900px) 100vw, 1200px"
            priority={activeIndex === 0}
            unoptimized
          />
        </button>
        <button
          className={`${styles.slideArrow} ${styles.slideArrowPrevious}`}
          type="button"
          onClick={showPrevious}
          aria-label="Show previous slide"
        >
          <LuChevronLeft aria-hidden="true" />
        </button>
        <button
          className={`${styles.slideArrow} ${styles.slideArrowNext}`}
          type="button"
          onClick={showNext}
          aria-label="Show next slide"
        >
          <LuChevronRight aria-hidden="true" />
        </button>
      </div>
      <p className={styles.slideCounter} data-slide-counter="true" aria-live="polite">
        <span>Slide</span>
        <strong>{activeIndex + 1} / {slides.length}</strong>
      </p>
      <div className={styles.slideViewerMeta}>
        <span>Use the controls, arrow keys or swipe to move through the case study.</span>
        <a href={downloadHref} download>
          Download presentation ↓
        </a>
      </div>
    </section>
  );
}

type PdfViewerProps = {
  src: string;
  coverSrc: string;
  pages: string[];
  label: string;
};

export function PdfViewer({ src, coverSrc, pages, label }: PdfViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className={styles.pdfPreview}
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Open ${label}`}
      >
        <Image
          src={coverSrc}
          alt={`Cover of ${label}`}
          width={992}
          height={1403}
          sizes="(max-width: 820px) 90vw, 42vw"
          priority
          unoptimized
        />
        <span>
          Read the full report
          <i aria-hidden="true">↗</i>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.pdfDialog}
        aria-label={label}
      >
        <div className={styles.pdfDialogPanel}>
          <header>
            <div>
              <span>Document viewer</span>
              <strong>{label}</strong>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close document">
              Close ×
            </button>
          </header>
          <div className={styles.pdfPageList} aria-label={`${label}, ${pages.length} pages`}>
            {pages.map((page, index) => (
              <figure key={page}>
                <Image
                  src={page}
                  alt={`${label}, page ${index + 1} of ${pages.length}`}
                  width={1075}
                  height={1521}
                  sizes="(max-width: 900px) 100vw, 900px"
                  unoptimized
                />
                <figcaption>Page {index + 1} / {pages.length}</figcaption>
              </figure>
            ))}
          </div>
          <footer>
            <p>If the document does not appear in your browser, open or download the original PDF.</p>
            <a href={src} target="_blank" rel="noreferrer">
              Open PDF ↗
            </a>
          </footer>
        </div>
      </dialog>
    </>
  );
}

export function PendingProjectMedia({ label, message }: { label: string; message: string }) {
  return (
    <section className={`${styles.media} ${styles.pendingCaseStudy}`} aria-label={label}>
      <div className={styles.pendingGrid} aria-hidden="true" />
      <div>
        <span>Preparing / 01</span>
        <h2>{label}</h2>
        <p>{message}</p>
      </div>
    </section>
  );
}
