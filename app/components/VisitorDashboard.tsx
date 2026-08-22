"use client";

import { useCallback, useEffect, useState } from "react";

type VisitorPeriod = {
  start: string;
  end: string;
  visitors: number;
};

type VisitorStats = {
  currentWeek: VisitorPeriod;
  previousWeek: VisitorPeriod;
  updatedAt: string;
};

function formatDateRange(period: VisitorPeriod | undefined) {
  if (!period) return "Loading weekly period";
  const format = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short" });
  return `${format.format(new Date(`${period.start}T00:00:00+08:00`))} — ${format.format(new Date(`${period.end}T00:00:00+08:00`))}`;
}

export function VisitorDashboard() {
  const [stats, setStats] = useState<VisitorStats>();
  const [failed, setFailed] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch("/api/visitor-stats", {
        credentials: "same-origin",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Visitor stats request failed");
      setStats((await response.json()) as VisitorStats);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    const refresh = () => void loadStats();
    const initialLoad = window.setTimeout(refresh, 0);
    window.addEventListener("portfolio:visit-registered", refresh);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener("portfolio:visit-registered", refresh);
    };
  }, [loadStats]);

  const comparison = stats
    ? stats.currentWeek.visitors - stats.previousWeek.visitors
    : undefined;

  return (
    <section className="visitor-dashboard" aria-live="polite" aria-busy={!stats && !failed}>
      <div className="visitor-primary-stat">
        <p>This week</p>
        <output>{failed ? "—" : (stats?.currentWeek.visitors ?? "··")}</output>
        <span>{failed ? "Counter temporarily unavailable" : formatDateRange(stats?.currentWeek)}</span>
      </div>

      <div className="visitor-secondary-stat">
        <div>
          <p>Last week</p>
          <strong>{failed ? "—" : (stats?.previousWeek.visitors ?? "··")}</strong>
        </div>
        <div>
          <p>Weekly change</p>
          <strong>
            {comparison === undefined ? "··" : `${comparison > 0 ? "+" : ""}${comparison}`}
          </strong>
        </div>
      </div>

      <p className="visitor-dashboard-note">
        One anonymous browser profile counts once per Perth week, even when its network changes.
      </p>
    </section>
  );
}
