"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { portfolio } from "../data/portfolio";
import styles from "../version-two.module.css";

type DirectoryEntry = "bio" | "education" | "location";

const entries: Array<{ id: DirectoryEntry; label: string }> = [
  { id: "bio", label: "bio.md" },
  { id: "education", label: "education.md" },
  { id: "location", label: "location.md" },
];

/**
 * Keeps the three profile views in one accessible tab pattern while sourcing
 * public facts and images from the portfolio's verified data and assets.
 */
export function AboutDirectory() {
  const [activeEntry, setActiveEntry] = useState<DirectoryEntry>("bio");
  const [pdfOpen, setPdfOpen] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const pdfDialogRef = useRef<HTMLDialogElement | null>(null);
  const pdfTriggerRef = useRef<HTMLButtonElement | null>(null);
  const { person, education } = portfolio;

  function openPdf() {
    setPdfOpen(true);
    requestAnimationFrame(() => pdfDialogRef.current?.showModal());
  }

  function closePdf() {
    pdfDialogRef.current?.close();
    setPdfOpen(false);
    requestAnimationFrame(() => pdfTriggerRef.current?.focus());
  }

  useEffect(() => {
    if (!pdfOpen) return;

    function closeFromKeyboard(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      pdfDialogRef.current?.close();
      setPdfOpen(false);
      requestAnimationFrame(() => pdfTriggerRef.current?.focus());
    }

    document.addEventListener("keydown", closeFromKeyboard, true);
    return () => document.removeEventListener("keydown", closeFromKeyboard, true);
  }, [pdfOpen]);

  function selectFromKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const previousKeys = ["ArrowLeft", "ArrowUp"];
    const nextKeys = ["ArrowRight", "ArrowDown"];
    let nextIndex = index;

    if (previousKeys.includes(event.key)) {
      nextIndex = (index - 1 + entries.length) % entries.length;
    } else if (nextKeys.includes(event.key)) {
      nextIndex = (index + 1) % entries.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = entries.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextEntry = entries[nextIndex];
    setActiveEntry(nextEntry.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className={styles.profileWindow}>
      <div className={styles.windowChrome} aria-hidden="true">
        <span className={styles.windowControls}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.windowTitle}>About CHIT THWAY</span>
        <span className={styles.windowStatus}>Profile</span>
      </div>

      <div className={styles.windowPath}>
        <span>Profile</span>
        <span aria-hidden="true">/</span>
        <strong>{entries.find((entry) => entry.id === activeEntry)?.label}</strong>
      </div>

      <div className={styles.windowBody}>
        <aside className={styles.directorySidebar} aria-label="About directory">
          <p>Directory</p>
          <div className={styles.directoryTabs} role="tablist" aria-orientation="vertical">
            {entries.map((entry, index) => (
              <button
                key={entry.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={`profile-tab-${entry.id}`}
                type="button"
                role="tab"
                aria-selected={activeEntry === entry.id}
                aria-controls={`profile-panel-${entry.id}`}
                tabIndex={activeEntry === entry.id ? 0 : -1}
                onClick={() => setActiveEntry(entry.id)}
                onKeyDown={(event) => selectFromKeyboard(event, index)}
              >
                <span aria-hidden="true" />
                {entry.label}
              </button>
            ))}
          </div>
        </aside>

        <div
          className={styles.profilePanel}
          id={`profile-panel-${activeEntry}`}
          role="tabpanel"
          aria-labelledby={`profile-tab-${activeEntry}`}
          tabIndex={0}
        >
          {activeEntry === "bio" ? (
            <>
              <div className={styles.profileCopy}>
                <p className={styles.activeFile}>Active file · bio.md</p>
                <h3>Support-minded by design.</h3>
                <p className={styles.profileSummary}>
                  I work where software, systems and people meet—investigating problems, testing
                  behaviour and making the next step easier to understand.
                </p>
                <dl className={styles.profileFacts}>
                  <div>
                    <dt>Focus</dt>
                    <dd>Application support, QA and technical support</dd>
                  </div>
                  <div>
                    <dt>Method</dt>
                    <dd>Investigate, validate, communicate</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd className={styles.availableFact}>{person.availability}</dd>
                  </div>
                </dl>
              </div>
              <div className={`${styles.profileVisual} ${styles.bioVisual}`}>
                {person.profileImage ? (
                  <Image
                    src={person.profileImage}
                    alt={`Portrait of ${person.name}`}
                    fill
                    unoptimized
                    sizes="(max-width: 820px) 84vw, 280px"
                  />
                ) : null}
                <span>{person.name}</span>
              </div>
            </>
          ) : null}

          {activeEntry === "education" ? (
            <>
              <div className={styles.profileCopy}>
                <p className={styles.activeFile}>Active file · education.md</p>
                <h3>Computer Science</h3>
                <p className={styles.profileSummary}>
                  A broad computing foundation strengthened through applied development, testing,
                  support tooling and collaborative technical work.
                </p>
                <dl className={styles.profileFacts}>
                  <div>
                    <dt>Degree</dt>
                    <dd>{education.qualification}</dd>
                  </div>
                  <div>
                    <dt>University</dt>
                    <dd>{education.institution}</dd>
                  </div>
                  <div>
                    <dt>Completion</dt>
                    <dd>{education.completion}</dd>
                  </div>
                </dl>
                <button
                  className={styles.ahegsButton}
                  type="button"
                  ref={pdfTriggerRef}
                  aria-haspopup="dialog"
                  onClick={openPdf}
                >
                  View graduation statement <span aria-hidden="true">↗</span>
                </button>
              </div>
              <div className={`${styles.profileVisual} ${styles.educationVisual}`}>
                <Image
                  src="/about/uwa-education.png"
                  alt="University of Western Australia campus courtyard"
                  fill
                  unoptimized
                  sizes="(max-width: 820px) 84vw, 280px"
                />
              </div>
            </>
          ) : null}

          {activeEntry === "location" ? (
            <>
              <div className={styles.profileCopy}>
                <p className={styles.activeFile}>Active file · location.md</p>
                <h3>Based in Perth, Western Australia.</h3>
                <p className={styles.profileSummary}>
                  Positioned for graduate and entry-level opportunities where careful technical
                  work and clear customer communication matter.
                </p>
                <dl className={styles.profileFacts}>
                  <div>
                    <dt>Base</dt>
                    <dd>{person.location}</dd>
                  </div>
                  <div>
                    <dt>Timezone</dt>
                    <dd>Australian Western Standard Time · UTC+8</dd>
                  </div>
                  <div>
                    <dt>Availability</dt>
                    <dd className={styles.availableFact}>{person.availability}</dd>
                  </div>
                </dl>
              </div>
              <div className={`${styles.profileVisual} ${styles.locationVisual}`}>
                <Image
                  src="/about/perth-location.png"
                  alt="Green Cactus sculpture in central Perth"
                  fill
                  unoptimized
                  sizes="(max-width: 820px) 84vw, 280px"
                />
              </div>
            </>
          ) : null}
        </div>
      </div>

      {pdfOpen ? (
        <dialog
          className={styles.pdfDialog}
          ref={pdfDialogRef}
          aria-labelledby="ahegs-dialog-title"
          onCancel={(event) => {
            event.preventDefault();
            closePdf();
          }}
        >
          <div className={styles.pdfDialogHeader}>
            <div>
              <span>Education record</span>
              <strong id="ahegs-dialog-title">Australian Higher Education Graduation Statement</strong>
            </div>
            <div className={styles.pdfDialogActions}>
              <a href="/chit-thway-ahegs.pdf" target="_blank" rel="noreferrer">
                Open separately
              </a>
              <button type="button" onClick={closePdf} aria-label="Close graduation statement">
                ×
              </button>
            </div>
          </div>
          <iframe
            className={styles.pdfViewer}
            src="/chit-thway-ahegs.pdf#view=FitH&toolbar=1"
            title="Australian Higher Education Graduation Statement for Chit Thway"
          />
        </dialog>
      ) : null}
    </div>
  );
}
