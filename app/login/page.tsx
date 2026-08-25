import type { Metadata } from "next";
import { DiaryLoginForm } from "../components/DiaryLoginForm";
import styles from "../diary/diary.module.css";

export const metadata: Metadata = {
  title: "Private Entrance | CHIT THWAY",
  description: "Unlisted administration entrance for the CHIT THWAY Diary.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
  },
};

export default function LoginPage() {
  return (
    <div className={styles.diarySite}>
      <main className={styles.loginPage}>
        <a className={styles.loginReturn} href="/diary/">
          <span aria-hidden="true">←</span> Return to Diary
        </a>
        <section className={styles.loginPanel} aria-labelledby="private-entrance-title">
          <p className={styles.eyebrow}>Unlisted · Administration</p>
          <h1 id="private-entrance-title">Private entrance.</h1>
          <p>
            This door is deliberately absent from public navigation. Publishing still requires a
            valid server-side session.
          </p>
          <DiaryLoginForm />
        </section>
      </main>
    </div>
  );
}
