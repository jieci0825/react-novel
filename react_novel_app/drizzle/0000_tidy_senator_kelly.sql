CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` text NOT NULL,
	`book_name` text NOT NULL,
	`author` text NOT NULL,
	`cover` text,
	`is_bookshelf` integer NOT NULL,
	`total_chapter` integer NOT NULL,
	`last_read_chapter_page_index` integer NOT NULL,
	`last_read_time` integer NOT NULL,
	`last_read_chapter_index` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chapters` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chapter_name` text NOT NULL,
	`content` text NOT NULL,
	`chapterIndex` integer NOT NULL,
	`books_id` integer NOT NULL
);
