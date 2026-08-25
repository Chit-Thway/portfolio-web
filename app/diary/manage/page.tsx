import type { Metadata } from "next";
import { DiaryManager } from "../../components/DiaryManager";
import styles from "../diary.module.css";

export const metadata: Metadata = {
  title: "Diary Publisher | CHIT THWAY",
  description: "Protected publishing workspace for the CHIT THWAY Diary.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
};

export default function DiaryManagePage() {
  return (
    <div className={styles.diarySite}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.wordmark} href="/diary/">
            CHIT THWAY / DIARY
          </a>
          <nav aria-label="Publishing navigation">
            <a href="/diary/">Public Diary</a>
          </nav>
        </div>
      </header>
      <main className={styles.managerPage}>
        <div className={styles.managerIntroduction}>
          <p className={styles.eyebrow}>Unlisted workspace</p>
          <h1>Publish a moment.</h1>
          <p>Posts appear publicly only after the upload and database record both succeed.</p>
        </div>
        <DiaryManager />
      </main>
    </div>
  );
}
