"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { FaLocationDot } from "react-icons/fa6";
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { person, education } = portfolio;

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
                <h3>Computer Science, grounded in practice.</h3>
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
              </div>
              <div className={`${styles.profileVisual} ${styles.educationVisual}`}>
                <Image
                  src="/uwa-logo.png"
                  alt="The University of Western Australia"
                  width={240}
                  height={240}
                  unoptimized
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
                <FaLocationDot aria-hidden="true" />
                <strong>PERTH</strong>
                <span>WA · AU</span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
