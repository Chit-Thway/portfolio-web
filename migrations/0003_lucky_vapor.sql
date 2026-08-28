CREATE TABLE `diary_post_links` (
	`post_id` text NOT NULL,
	`position` integer NOT NULL,
	`url` text NOT NULL,
	PRIMARY KEY(`post_id`, `position`),
	FOREIGN KEY (`post_id`) REFERENCES `diary_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_diary_post_links_post` ON `diary_post_links` (`post_id`,`position`);