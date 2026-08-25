"use client";

import { FormEvent, useEffect, useState } from "react";
import styles from "../diary/diary.module.css";

export function DiaryLoginForm() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function checkSession() {
      try {
        const response = await fetch("/api/diary/session", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const payload = (await response.json()) as { authenticated?: boolean };
        if (payload.authenticated) window.location.replace("/diary/manage/");
      } catch {
        // The form remains usable; submission will report configuration errors.
      }
    }

    void checkSession();
    return () => controller.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/diary/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setMessage(payload.error ?? "Sign-in was not accepted.");
        setStatus("idle");
        return;
      }

      window.location.assign("/diary/manage/");
    } catch {
      setMessage("The private entrance is unavailable in this preview.");
      setStatus("idle");
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <label htmlFor="diary-password">Admin passphrase</label>
      <input
        id="diary-password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        maxLength={512}
        required
      />
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Checking…" : "Enter publishing space"}
        <span aria-hidden="true">→</span>
      </button>
      <p className={styles.formMessage} role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
