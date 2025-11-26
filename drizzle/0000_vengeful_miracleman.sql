CREATE TABLE `accounts` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `account_provider_id_idx` UNIQUE(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`followerId` varchar(255) NOT NULL,
	`followingId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `follower_following_idx` UNIQUE(`followerId`,`followingId`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `sessions_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`username` varchar(50),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3),
	`image` varchar(255),
	`role` enum('user','moderator','admin') DEFAULT 'user',
	`isVerified` boolean DEFAULT false,
	`reputationScore` int DEFAULT 0,
	`bio` text,
	`website` varchar(255),
	`twitterHandle` varchar(50),
	`githubHandle` varchar(50),
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `email_idx` UNIQUE(`email`),
	CONSTRAINT `username_idx` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `identifier_token_idx` UNIQUE(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `ai_models` (
	`id` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`provider` varchar(100),
	`iconUrl` varchar(500),
	`color` varchar(7),
	`isActive` int DEFAULT 1,
	`sortOrder` int DEFAULT 0,
	CONSTRAINT `ai_models_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_models_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(50),
	`color` varchar(7),
	`parentId` varchar(255),
	`promptCount` int DEFAULT 0,
	`sortOrder` int DEFAULT 0,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` varchar(255) NOT NULL,
	`name` varchar(50) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`description` varchar(255),
	`usageCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `prompt_tags` (
	`promptId` varchar(255) NOT NULL,
	`tagId` varchar(255) NOT NULL,
	CONSTRAINT `prompt_tag_pk` UNIQUE(`promptId`,`tagId`)
);
--> statement-breakpoint
CREATE TABLE `prompt_versions` (
	`id` varchar(255) NOT NULL,
	`promptId` varchar(255) NOT NULL,
	`versionNumber` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`description` text,
	`changeSummary` varchar(500),
	`createdBy` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `prompt_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_version` UNIQUE(`promptId`,`versionNumber`)
);
--> statement-breakpoint
CREATE TABLE `prompts` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`description` text,
	`instructions` text,
	`exampleOutput` text,
	`variables` json,
	`categoryId` varchar(255),
	`aiModelId` varchar(255),
	`visibility` enum('public','private','unlisted') DEFAULT 'public',
	`status` enum('draft','published','archived') DEFAULT 'published',
	`isFeatured` boolean DEFAULT false,
	`isStaffPick` boolean DEFAULT false,
	`viewCount` int DEFAULT 0,
	`copyCount` int DEFAULT 0,
	`bookmarkCount` int DEFAULT 0,
	`forkCount` int DEFAULT 0,
	`shareCount` int DEFAULT 0,
	`commentCount` int DEFAULT 0,
	`ratingAvg` decimal(3,2) DEFAULT '0.00',
	`ratingCount` int DEFAULT 0,
	`metaTitle` varchar(70),
	`metaDescription` varchar(160),
	`ogImageUrl` varchar(500),
	`forkedFromId` varchar(255),
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `prompts_id` PRIMARY KEY(`id`),
	CONSTRAINT `prompts_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`promptId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_bookmark` UNIQUE(`userId`,`promptId`)
);
--> statement-breakpoint
CREATE TABLE `collection_prompts` (
	`collectionId` varchar(255) NOT NULL,
	`promptId` varchar(255) NOT NULL,
	`sortOrder` int DEFAULT 0,
	`addedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `collection_prompt_pk` UNIQUE(`collectionId`,`promptId`)
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`coverImageUrl` varchar(500),
	`visibility` enum('public','private') DEFAULT 'private',
	`promptCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collections_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_slug` UNIQUE(`userId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` varchar(255) NOT NULL,
	`promptId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`parentId` varchar(255),
	`content` text NOT NULL,
	`isEdited` boolean DEFAULT false,
	`likeCount` int DEFAULT 0,
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ratings` (
	`id` varchar(255) NOT NULL,
	`promptId` varchar(255) NOT NULL,
	`userId` varchar(255),
	`guestFingerprint` varchar(64),
	`score` tinyint NOT NULL,
	`ipHash` varchar(64),
	`createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_rating` UNIQUE(`promptId`,`userId`),
	CONSTRAINT `unique_guest_rating` UNIQUE(`promptId`,`guestFingerprint`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `accounts` (`userId`);--> statement-breakpoint
CREATE INDEX `follower_idx` ON `follows` (`followerId`);--> statement-breakpoint
CREATE INDEX `following_idx` ON `follows` (`followingId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `tag_idx` ON `prompt_tags` (`tagId`);--> statement-breakpoint
CREATE INDEX `promptId_idx` ON `prompt_versions` (`promptId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `prompts` (`userId`);--> statement-breakpoint
CREATE INDEX `categoryId_idx` ON `prompts` (`categoryId`);--> statement-breakpoint
CREATE INDEX `search_idx` ON `prompts` (`title`,`description`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `bookmarks` (`userId`);--> statement-breakpoint
CREATE INDEX `prompt_idx` ON `collection_prompts` (`promptId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `collections` (`userId`);--> statement-breakpoint
CREATE INDEX `prompt_idx` ON `comments` (`promptId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `comments` (`userId`);--> statement-breakpoint
CREATE INDEX `parent_idx` ON `comments` (`parentId`);--> statement-breakpoint
CREATE INDEX `prompt_idx` ON `ratings` (`promptId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `ratings` (`userId`);