import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const weeklyVisitors = sqliteTable(
  "weekly_visitors",
  {
    weekStart: text("week_start").notNull(),
    visitorHash: text("visitor_hash").notNull(),
    firstSeenAt: text("first_seen_at").notNull(),
  },
  (table) => [
    uniqueIndex("idx_weekly_visitors_week_hash").on(
      table.weekStart,
      table.visitorHash,
    ),
  ],
);
