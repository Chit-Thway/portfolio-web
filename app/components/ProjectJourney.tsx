"use client";

import { useRef } from "react";
import { LuArrowUpRight, LuSprout, LuTreePine, LuX } from "react-icons/lu";
import type { ProjectJourneyData } from "@/app/data/projectCaseStudies";
import styles from "./ProjectJourney.module.css";

type ProjectJourneyProps = {
  projectTitle: string;
  journey: ProjectJourneyData;
};

export function ProjectJourney({ projectTitle, journey }: ProjectJourneyProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openJourney() {
    dialogRef.current?.showModal();
  }

  function closeJourney() {
    dialogRef.current?.close();
  }

  return (
    <section
      className={styles.projectJourney}
      data-project-journey="true"
      aria-label={`${projectTitle} process`}
    >
      <button
        className={styles.trigger}
        type="button"
        aria-haspopup="dialog"
        onClick={openJourney}
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          <LuSprout />
        </span>
        <span className={styles.triggerCopy}>
          <span>The process</span>
          <strong>How this project grew</strong>
        </span>
        <span className={styles.triggerAction} aria-hidden="true">
          Open <LuArrowUpRight />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="journey-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeJourney();
        }}
      >
        <div className={styles.dialogShell}>
          <header className={styles.dialogHeader}>
            <div className={styles.dialogHeading}>
              <span className={styles.dialogMark} aria-hidden="true">
                <LuTreePine />
              </span>
              <div>
                <p>The process</p>
                <h2 id="journey-dialog-title">{journey.title}</h2>
              </div>
            </div>
            <button type="button" onClick={closeJourney} aria-label="Close project process">
              <LuX aria-hidden="true" />
            </button>
          </header>

          <div className={styles.dialogBody}>
            <ol className={styles.timeline}>
              {journey.items.map((item, index) => (
                <li
                  key={`${item.kind}-${item.title}`}
                  data-journey-kind={item.kind.toLowerCase()}
                  data-journey-highlight={item.badge ? "true" : undefined}
                >
                  <span className={styles.node} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                    {item.badge ? <span className={styles.nodeStar}>★</span> : null}
                  </span>
                  <article
                    className={`${styles.card}${
                      journey.showLinks !== false && item.link
                        ? ` ${styles.cardHasLink}`
                        : ""
                    }`}
                  >
                    {item.badge ? (
                      <p className={styles.badge}>
                        <span aria-hidden="true">★</span> {item.badge}
                      </p>
                    ) : null}
                    <p className={styles.kind}>{item.label ?? item.kind}</p>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    {journey.showLinks !== false && item.link ? (
                      <a
                        className={styles.nodeLink}
                        data-journey-link="true"
                        href={item.link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${item.link.label} (opens in a new tab)`}
                        title={item.link.label}
                      >
                        <LuArrowUpRight aria-hidden="true" />
                      </a>
                    ) : null}
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </dialog>
    </section>
  );
}
