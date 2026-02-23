CREATE TABLE `voiceSamples` (
	`id` int AUTO_INCREMENT NOT NULL,
	`voiceProfileId` int NOT NULL,
	`audioUrl` text NOT NULL,
	`sampleText` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `voiceSamples_id` PRIMARY KEY(`id`)
);
