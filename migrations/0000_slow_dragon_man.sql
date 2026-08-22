CREATE TABLE `weekly_visitors` (
	`week_start` text NOT NULL,
	`visitor_hash` text NOT NULL,
	`first_seen_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_weekly_visitors_week_hash` ON `weekly_visitors` (`week_start`,`visitor_hash`);
--> statement-breakpoint
PRAGMA optimize;
