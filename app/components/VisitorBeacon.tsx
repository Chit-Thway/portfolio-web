"use client";

import { useEffect } from "react";

export function VisitorBeacon() {
  useEffect(() => {
    void fetch("/api/visit", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { Accept: "application/json" },
    }).finally(() => {
      window.dispatchEvent(new Event("portfolio:visit-registered"));
    });
  }, []);

  return null;
}
