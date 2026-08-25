"use client";

import { useSyncExternalStore } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";
import styles from "../version-two.module.css";

type Theme = "light" | "dark";

const themeChangeEvent = "portfolio-theme-change";

function readCurrentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function readServerTheme(): Theme {
  return "light";
}

function subscribeToTheme(callback: () => void) {
  window.addEventListener(themeChangeEvent, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(themeChangeEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readCurrentTheme, readServerTheme);
  const nextTheme = theme === "dark" ? "light" : "dark";

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("portfolio-theme", nextTheme);
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <button
      className={styles.themeToggle}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
    >
      <span className={styles.themeToggleIcons} aria-hidden="true">
        <FaSun />
        <FaMoon />
      </span>
      <span className={styles.themeToggleThumb} aria-hidden="true" />
    </button>
  );
}
