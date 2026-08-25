CREATE TABLE `diary_login_attempts` (
	`fingerprint_hash` text PRIMARY KEY NOT NULL,
	`window_started_at` text NOT NULL,
	`attempt_count` integer DEFAULT 0 NOT NULL,
	`blocked_until` text
);
--> statement-breakpoint
CREATE TABLE `diary_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`caption` text DEFAULT '' NOT NULL,
	`alt_text` text NOT NULL,
	`location` text,
	`media_key` text NOT NULL,
	`media_type` text NOT NULL,
	`media_size` integer NOT NULL,
	`audio_key` text,
	`audio_type` text,
	`audio_title` text,
	`status` text DEFAULT 'published' NOT NULL,
	`published_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_diary_posts_status_published` ON `diary_posts` (`status`,`published_at`);