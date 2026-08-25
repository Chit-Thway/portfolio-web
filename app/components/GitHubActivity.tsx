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

const calendarDays = 56;
const publicEventWindowDays = 30;

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
 * GitHub's public events feed is treated as a recent activity snapshot rather
 * than a contribution total. The visual includes eight weeks for context, but
 * days outside GitHub's public event window are marked as unavailable instead
 * of being represented as zero.
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

    const availableFrom = new Date(today);
    availableFrom.setUTCDate(today.getUTCDate() - (publicEventWindowDays - 1));

    // Anchor every calendar column to a Sunday–Saturday week. The final
    // column is the current partial week, matching GitHub's visual convention.
    const calendarStart = new Date(today);
    calendarStart.setUTCDate(today.getUTCDate() - today.getUTCDay() - 7 * 7);

    const days = Array.from({ length: calendarDays }, (_, index) => {
      const date = new Date(calendarStart);
      date.setUTCDate(calendarStart.getUTCDate() + index);
      const future = date > today;

      return {
        key: dateKey(date),
        count: 0,
        future,
        available: !future && date >= availableFrom,
      };
    });
    const dayMap = new Map(days.map((day) => [day.key, day]));

    for (const event of events) {
      const day = dayMap.get(event.created_at.slice(0, 10));
      if (day?.available) {
        day.count += 1;
      }
    }

    return {
      days,
      activeDays: days.filter((day) => day.available && day.count > 0).length,
      repositories: new Set(events.map((event) => event.repo.name)).size,
      latest: events.slice(0, 3),
      todayKey: dateKey(today),
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
              <strong>Recent eight-week view</strong>
              <span>{formatDate(activity.todayKey)}</span>
            </div>

            <div className={styles.githubActivityCalendar}>
              <div className={styles.githubActivityWeekdays} aria-hidden="true">
                <span />
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
              </div>
              <ol aria-label="Recent public GitHub development activity">
                {activity.days.map((day) => (
                  <li
                    key={day.key}
                    data-level={Math.min(day.count, 4)}
                    data-available={day.available}
                    data-future={day.future}
                    aria-label={
                      day.future
                        ? `${formatDate(day.key)}: future date`
                        : day.available
                          ? `${formatDate(day.key)}: ${day.count} public development ${day.count === 1 ? "event" : "events"}`
                          : `${formatDate(day.key)}: outside GitHub's public event window`
                    }
                    title={
                      day.future
                        ? undefined
                        : day.available
                          ? `${formatDate(day.key)} · ${day.count} ${day.count === 1 ? "event" : "events"}`
                          : `${formatDate(day.key)} · public event history unavailable`
                    }
                  />
                ))}
              </ol>
            </div>

            <div className={styles.githubActivityLegend} aria-hidden="true">
              <span>Public data unavailable</span>
              <i data-kind="unavailable" />
              <span>Less</span>
              <i data-level="0" />
              <i data-level="1" />
              <i data-level="2" />
              <i data-level="3" />
              <i data-level="4" />
              <span>More</span>
            </div>
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
        Public GitHub events only · the coloured cells use the available recent event window · older
        days are shown for layout context and are not treated as zero activity.
      </p>
    </div>
  );
}
