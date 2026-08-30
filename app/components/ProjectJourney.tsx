"use client";

import { useRef } from "react";
import { LuArrowUpRight, LuSprout, LuTreePine, LuX } from "react-icons/lu";
import type { ProjectCaseStudy } from "@/app/data/projectCaseStudies";

type ProjectJourneyProps = {
  projectTitle: string;
  journey: NonNullable<ProjectCaseStudy["journey"]>;
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
    <section className="project-journey" aria-label={`${projectTitle} process`}>
      <button
        className="journey-trigger"
        type="button"
        aria-haspopup="dialog"
        onClick={openJourney}
      >
        <span className="journey-trigger-icon" aria-hidden="true">
          <LuSprout />
        </span>
        <span className="journey-trigger-copy">
          <span>The process</span>
          <strong>How this project grew</strong>
        </span>
        <span className="journey-trigger-action" aria-hidden="true">
          Open <LuArrowUpRight />
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="journey-dialog"
        aria-labelledby="journey-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeJourney();
        }}
      >
        <div className="journey-dialog-shell">
          <header className="journey-dialog-header">
            <div className="journey-dialog-heading">
              <span className="journey-dialog-mark" aria-hidden="true">
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

          <div className="journey-dialog-body">
            <ol className="journey-timeline">
              {journey.items.map((item, index) => (
                <li
                  key={`${item.kind}-${item.title}`}
                  data-journey-kind={item.kind.toLowerCase()}
                  data-journey-highlight={item.badge ? "true" : undefined}
                >
                  <span className="journey-node" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                    {item.badge ? <span className="journey-node-star">★</span> : null}
                  </span>
                  <article
                    className={journey.showLinks !== false && item.link ? "journey-card has-link" : "journey-card"}
                  >
                    {item.badge ? (
                      <p className="journey-badge">
                        <span aria-hidden="true">★</span> {item.badge}
                      </p>
                    ) : null}
                    <p className="journey-kind">{item.label ?? item.kind}</p>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    {journey.showLinks !== false && item.link ? (
                      <a
                        className="journey-node-link"
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
