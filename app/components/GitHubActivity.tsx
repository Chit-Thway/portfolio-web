"use client";

import { useEffect, useMemo, useState } from "react";
import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";
import styles from "../version-two.module.css";

type GitHubActivityProps = {
  username: string;
  profileUrl: string;
};

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
};

const developmentEventTypes = new Set([
  "CreateEvent",
  "DeleteEvent",
  "ForkEvent",
  "IssueCommentEvent",
  "IssuesEvent",
  "PullRequestEvent",
  "PullRequestReviewEvent",
  "PullRequestReviewCommentEvent",
  "PushEvent",
  "ReleaseEvent",
]);

const eventLabels: Record<string, string> = {
  CreateEvent: "Created a repository or branch",
  DeleteEvent: "Removed a branch or tag",
  ForkEvent: "Forked a repository",
  IssueCommentEvent: "Contributed to an issue discussion",
  IssuesEvent: "Updated an issue",
  PullRequestEvent: "Updated a pull request",
  PullRequestReviewEvent: "Reviewed a pull request",
  PullRequestReviewCommentEvent: "Commented on a pull request",
  PushEvent: "Pushed changes",
  ReleaseEvent: "Published a release",
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

/**
 * GitHub's public events feed is intentionally treated as a recent activity
 * snapshot, not as a contribution count. Private work and older contributions
 * are never estimated or represented as zero.
 */
export function GitHubActivity({ username, profileUrl }: GitHubActivityProps) {
  const [events, setEvents] = useState<GitHubEvent[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivity() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`,
          {
            headers: { Accept: "application/vnd.github+json" },
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(`GitHub activity request returned ${response.status}`);
        }

        const result = (await response.json()) as GitHubEvent[];
        setEvents(result.filter((event) => developmentEventTypes.has(event.type)));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setFailed(true);
      }
    }

    void loadActivity();
    return () => controller.abort();
  }, [username]);

  const activity = useMemo(() => {
    if (!events) {
      return null;
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - (29 - index));
      return { key: dateKey(date), count: 0 };
    });
    const dayMap = new Map(days.map((day) => [day.key, day]));

    for (const event of events) {
      const day = dayMap.get(event.created_at.slice(0, 10));
      if (day) {
        day.count += 1;
      }
    }

    return {
      days,
      activeDays: days.filter((day) => day.count > 0).length,
      repositories: new Set(events.map((event) => event.repo.name)).size,
      latest: events.slice(0, 3),
    };
  }, [events]);

  return (
    <div className={styles.githubActivityPanel} data-github-source="public-events">
      <div className={styles.githubActivityHeader}>
        <div>
          <p>
            <span aria-hidden="true" /> Recent public development activity
          </p>
          <h3>@{username}</h3>
        </div>
        <a href={profileUrl} target="_blank" rel="noreferrer">
          <FaGithub aria-hidden="true" /> View GitHub
          <FaArrowUpRightFromSquare aria-hidden="true" />
        </a>
      </div>

      {events === null && !failed ? (
        <div className={styles.githubActivityState} role="status">
          Loading recent public activity…
        </div>
      ) : null}

      {failed ? (
        <div className={styles.githubActivityState} role="status">
          Live activity is unavailable right now. The GitHub profile remains the source of truth.
        </div>
      ) : null}

      {activity ? (
        <>
          <dl className={styles.githubActivitySummary}>
            <div>
              <dt>Public events</dt>
              <dd>{events?.length ?? 0}</dd>
            </div>
            <div>
              <dt>Active days</dt>
              <dd>{activity.activeDays}</dd>
            </div>
            <div>
              <dt>Repositories</dt>
              <dd>{activity.repositories}</dd>
            </div>
          </dl>

          <div className={styles.githubActivityChart}>
            <div className={styles.githubActivityChartLabel}>
              <span>{formatDate(activity.days[0].key)}</span>
              <span>Last 30 days</span>
              <span>{formatDate(activity.days.at(-1)?.key ?? activity.days[0].key)}</span>
            </div>
            <ol aria-label="Public GitHub development events over the last 30 days">
              {activity.days.map((day) => (
                <li
                  key={day.key}
                  data-level={Math.min(day.count, 4)}
                  aria-label={`${formatDate(day.key)}: ${day.count} public development ${day.count === 1 ? "event" : "events"}`}
                  title={`${formatDate(day.key)} · ${day.count} ${day.count === 1 ? "event" : "events"}`}
                />
              ))}
            </ol>
          </div>

          {activity.latest.length > 0 ? (
            <ol className={styles.githubRecentEvents} aria-label="Latest public GitHub activity">
              {activity.latest.map((event) => (
                <li key={event.id}>
                  <span>{eventLabels[event.type] ?? "Updated a repository"}</span>
                  <strong>{event.repo.name.replace(`${username}/`, "")}</strong>
                  <time dateTime={event.created_at}>{formatDate(event.created_at.slice(0, 10))}</time>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.githubNoEvents}>
              No public development events were returned for this window.
            </p>
          )}
        </>
      ) : null}

      <p className={styles.githubActivityDisclosure}>
        Public events only · recent 30-day window · private work and older contributions are not
        inferred.
      </p>
    </div>
  );
}
