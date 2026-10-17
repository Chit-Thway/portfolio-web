"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { FaDownload, FaExpand, FaFilePdf, FaCompress } from "react-icons/fa6";
import { useDialogBackdropClose } from "../hooks/useDialogBackdropClose";
import styles from "../version-two.module.css";

type ResumeViewerProps = {
  src: string;
  variant?: "hero" | "contact";
};

export function ResumeViewer({ src, variant = "hero" }: ResumeViewerProps) {
  const dialogId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useDialogBackdropClose(dialogRef, close, open);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function show(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(true);
  }

  return (
    <>
      <a
        ref={triggerRef}
        className={variant === "hero" ? styles.secondaryAction : undefined}
        href={src}
        target="_blank"
        rel="noreferrer"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        onClick={show}
      >
        {variant === "hero" ? (
          <>View résumé <span aria-hidden="true">↗</span></>
        ) : (
          <>
            <span className={`${styles.contactActionIcon} ${styles.contactResumeIcon}`}>
              <FaFilePdf aria-hidden="true" />
            </span>
            <span><small>Résumé</small><strong>View PDF</strong></span>
            <span aria-hidden="true">↗</span>
          </>
        )}
      </a>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className={`${styles.pdfDialog} ${styles.resumeDialog}${expanded ? ` ${styles.resumeDialogExpanded}` : ""}`}
        aria-labelledby={`${dialogId}-title`}
        onClose={() => {
          setOpen(false);
          setExpanded(false);
          triggerRef.current?.focus();
        }}
      >
        <div className={styles.pdfDialogHeader}>
          <div>
            <strong id={`${dialogId}-title`}>Resume</strong>
          </div>
          <div className={`${styles.pdfDialogActions} ${styles.resumeToolbar}`}>
            <a href={src} download><FaDownload aria-hidden="true" /> Download</a>
            <button type="button" onClick={() => setExpanded(!expanded)} aria-pressed={expanded}>
              {expanded ? <FaCompress aria-hidden="true" /> : <FaExpand aria-hidden="true" />}
              {expanded ? "Exit full screen" : "Full screen"}
            </button>
            <a href={src} target="_blank" rel="noreferrer">Open in tab ↗</a>
            <button type="button" onClick={close} aria-label="Close résumé">×</button>
          </div>
        </div>
        {open ? (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The scrollable preview needs keyboard access to read the full page.
          <div className={styles.resumeDocument} role="region" aria-label="Résumé preview" tabIndex={0}>
            <Image
              src="/chit-thway-resume-preview.png"
              alt="Chit Thway résumé. Open in tab for the original accessible PDF."
              width={1836}
              height={2376}
              sizes="(max-width: 820px) 100vw, 1000px"
              unoptimized
            />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
