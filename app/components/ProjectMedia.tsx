"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";

type ProjectVideoProps = {
  src: string;
  label: string;
  duration: string;
};

export function ProjectVideo({ src, label, duration }: ProjectVideoProps) {
  return (
    <figure className="case-media case-video-frame">
      <video controls playsInline preload="metadata" aria-label={label}>
        <source src={src} type="video/mp4" />
        <track
          kind="captions"
          src={src.replace(/\.mp4$/i, ".vtt")}
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
};

export function SlideViewer({ slides, downloadHref, label }: SlideViewerProps) {
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
    <section className="case-media slide-viewer" aria-label={`${label} slide viewer`}>
      <button
        className="slide-stage"
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
      <div className="slide-controls">
        <button type="button" onClick={showPrevious} aria-label="Show previous slide">
          <span aria-hidden="true">←</span>
          Previous
        </button>
        <p aria-live="polite">
          <span>Slide</span> {activeIndex + 1} / {slides.length}
        </p>
        <button type="button" onClick={showNext} aria-label="Show next slide">
          Next
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="slide-viewer-meta">
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
        className="pdf-preview"
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
        className="pdf-dialog"
        aria-label={label}
      >
        <div className="pdf-dialog-panel">
          <header>
            <div>
              <span>Document viewer</span>
              <strong>{label}</strong>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close document">
              Close ×
            </button>
          </header>
          <div className="pdf-page-list" aria-label={`${label}, ${pages.length} pages`}>
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
    <section className="case-media pending-case-study" aria-label={label}>
      <div className="pending-grid" aria-hidden="true" />
      <div>
        <span>Preparing / 01</span>
        <h2>{label}</h2>
        <p>{message}</p>
      </div>
    </section>
  );
}
