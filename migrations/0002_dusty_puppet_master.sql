CREATE TABLE `diary_post_media` (
	`post_id` text NOT NULL,
	`position` integer NOT NULL,
	`media_key` text NOT NULL,
	`media_type` text NOT NULL,
	`media_size` integer NOT NULL,
	`alt_text` text NOT NULL,
	PRIMARY KEY(`post_id`, `position`),
	FOREIGN KEY (`post_id`) REFERENCES `diary_posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `diary_post_media` (`post_id`, `position`, `media_key`, `media_type`, `media_size`, `alt_text`)
SELECT `id`, 0, `media_key`, `media_type`, `media_size`, `alt_text`
FROM `diary_posts`;
--> statement-breakpoint
CREATE INDEX `idx_diary_post_media_post` ON `diary_post_media` (`post_id`,`position`);
