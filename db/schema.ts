import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

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

export const diaryPosts = sqliteTable(
  "diary_posts",
  {
    id: text("id").primaryKey(),
    caption: text("caption").notNull().default(""),
    altText: text("alt_text").notNull(),
    location: text("location"),
    mediaKey: text("media_key").notNull(),
    mediaType: text("media_type").notNull(),
    mediaSize: integer("media_size").notNull(),
    audioKey: text("audio_key"),
    audioType: text("audio_type"),
    audioTitle: text("audio_title"),
    status: text("status").notNull().default("published"),
    publishedAt: text("published_at").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("idx_diary_posts_status_published").on(
      table.status,
      table.publishedAt,
    ),
  ],
);

export const diaryPostMedia = sqliteTable(
  "diary_post_media",
  {
    postId: text("post_id")
      .notNull()
      .references(() => diaryPosts.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    mediaKey: text("media_key").notNull(),
    mediaType: text("media_type").notNull(),
    mediaSize: integer("media_size").notNull(),
    altText: text("alt_text").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.position] }),
    index("idx_diary_post_media_post").on(table.postId, table.position),
  ],
);

export const diaryPostLinks = sqliteTable(
  "diary_post_links",
  {
    postId: text("post_id")
      .notNull()
      .references(() => diaryPosts.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    url: text("url").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.position] }),
    index("idx_diary_post_links_post").on(table.postId, table.position),
  ],
);

export const diaryLoginAttempts = sqliteTable("diary_login_attempts", {
  fingerprintHash: text("fingerprint_hash").primaryKey(),
  windowStartedAt: text("window_started_at").notNull(),
  attemptCount: integer("attempt_count").notNull().default(0),
  blockedUntil: text("blocked_until"),
});
