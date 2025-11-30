DROP INDEX `search_idx` ON `prompts`;--> statement-breakpoint
ALTER TABLE `prompts` MODIFY COLUMN `userId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `passwordHash` varchar(255);