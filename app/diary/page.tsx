/* eslint-disable @next/next/no-html-link-for-pages -- static Cloudflare Pages navigation */
import type { Metadata } from "next";
import styles from "./diary.module.css";
import { DiaryFeed } from "../components/DiaryFeed";

export const metadata: Metadata = {
  title: "Diary | CHIT THWAY",
  description:
    "A personal collection of photos, short videos, sounds and notes from CHIT THWAY outside technical work.",
};

export default function DiaryPage() {
  return (
    <div className={styles.diarySite}>
      <a className={styles.skipLink} href="#diary-content">
        Skip to diary
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.wordmark} href="/">
            CHIT THWAY
          </a>
          <nav aria-label="Diary navigation">
            <a href="/#projects">Projects</a>
            <a href="/#experience">Experience</a>
            <a aria-current="page" href="/diary/">
              Diary
            </a>
          </nav>
        </div>
      </header>

      <main id="diary-content">
        <section className={styles.introduction}>
          <p className={styles.eyebrow}>Diary · Life outside the work</p>
          <h1>Small moments, kept with intention.</h1>
          <p className={styles.lede}>
            A personal feed for photos, short videos, sounds and the notes that belong with
            them. No polished case studies here—just the things worth remembering.
          </p>
        </section>

        <DiaryFeed />
      </main>

      <footer className={styles.footer}>
        <span>CHIT THWAY</span>
        <span>Perth, Western Australia</span>
      </footer>
    </div>
  );
}
