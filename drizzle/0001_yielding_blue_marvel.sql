CREATE TABLE `analyticsSnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`snapshotDate` timestamp NOT NULL,
	`metricType` varchar(100) NOT NULL,
	`sector` varchar(100),
	`region` varchar(100),
	`data` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analyticsSnapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assignmentId` int NOT NULL,
	`sponsorCompanyId` int NOT NULL,
	`approvedById` int,
	`status` enum('pending','approved','declined') NOT NULL DEFAULT 'pending',
	`conditions` text,
	`notes` text,
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`respondedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `approvals_id` PRIMARY KEY(`id`),
	CONSTRAINT `approvals_assignmentId_unique` UNIQUE(`assignmentId`)
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`workerId` int NOT NULL,
	`companyId` int NOT NULL,
	`sponsorCompanyId` int NOT NULL,
	`status` enum('pending_sponsor_approval','sponsor_approved','sponsor_declined','contract_generated','active','completed','cancelled') NOT NULL DEFAULT 'pending_sponsor_approval',
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`approvedAt` timestamp,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`contractUrl` text,
	`wageAmount` decimal(10,2) NOT NULL,
	`platformFee` decimal(10,2) DEFAULT '0.00',
	`totalAmount` decimal(10,2) NOT NULL,
	`paymentStatus` enum('pending','processing','completed','failed') DEFAULT 'pending',
	`workerRating` int,
	`workerReview` text,
	`companyRating` int,
	`companyReview` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`performedById` int,
	`performedByRole` varchar(50),
	`changes` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`nameAr` text,
	`crNumber` varchar(50) NOT NULL,
	`qiwaId` varchar(100),
	`nitaqatStatus` enum('platinum','green','yellow','red'),
	`sector` varchar(100),
	`industry` varchar(100),
	`address` text,
	`city` varchar(100),
	`region` varchar(100),
	`contactEmail` varchar(320),
	`contactPhone` varchar(20),
	`isVerified` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`subscriptionTier` enum('basic','pro','enterprise') DEFAULT 'basic',
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_crNumber_unique` UNIQUE(`crNumber`),
	CONSTRAINT `companies_qiwaId_unique` UNIQUE(`qiwaId`)
);
--> statement-breakpoint
CREATE TABLE `companyAdmins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','admin','manager') NOT NULL DEFAULT 'admin',
	`permissions` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `companyAdmins_id` PRIMARY KEY(`id`),
	CONSTRAINT `company_user_unique` UNIQUE(`companyId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `complianceChecks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assignmentId` int NOT NULL,
	`checkType` enum('worker_eligibility','visa_validity','company_nitaqat','insurance_status','ajeer_role_match','wps_compliance','duration_limits','sector_rules') NOT NULL,
	`status` enum('passed','failed','warning') NOT NULL,
	`details` json,
	`errorMessage` text,
	`checkedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `complianceChecks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`title` text NOT NULL,
	`titleAr` text,
	`description` text NOT NULL,
	`descriptionAr` text,
	`requiredSkills` json,
	`requiredCertifications` json,
	`sector` varchar(100),
	`ajeerRoleRequired` varchar(100),
	`workLocation` text,
	`city` varchar(100),
	`region` varchar(100),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`workingHours` varchar(100),
	`numberOfWorkers` int NOT NULL DEFAULT 1,
	`wageAmount` decimal(10,2) NOT NULL,
	`wageCurrency` varchar(10) DEFAULT 'SAR',
	`wageType` enum('hourly','daily','fixed') DEFAULT 'hourly',
	`status` enum('draft','active','filled','cancelled','completed') NOT NULL DEFAULT 'draft',
	`postedById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('approval_request','approval_response','assignment_update','payment_received','compliance_alert','system_announcement') NOT NULL,
	`title` text NOT NULL,
	`titleAr` text,
	`message` text NOT NULL,
	`messageAr` text,
	`relatedEntityType` varchar(50),
	`relatedEntityId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assignmentId` int NOT NULL,
	`type` enum('platform_fee','worker_payment','company_charge','refund') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'SAR',
	`fromCompanyId` int,
	`toWorkerId` int,
	`status` enum('pending','processing','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(50),
	`transactionReference` varchar(100),
	`wpsReference` varchar(100),
	`notes` text,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `transactions_transactionReference_unique` UNIQUE(`transactionReference`)
);
--> statement-breakpoint
CREATE TABLE `workerAvailability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workerId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workerAvailability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sponsorCompanyId` int NOT NULL,
	`nafathId` varchar(100),
	`iqamaNumber` varchar(50),
	`nationality` varchar(50),
	`dateOfBirth` timestamp,
	`visaType` varchar(50),
	`visaExpiryDate` timestamp,
	`ajeerRoleId` varchar(100),
	`primarySkill` varchar(100),
	`skills` json,
	`certifications` json,
	`experience` int,
	`insuranceNumber` varchar(100),
	`insuranceExpiryDate` timestamp,
	`wpsStatus` enum('compliant','non_compliant','pending') DEFAULT 'pending',
	`isVerified` boolean NOT NULL DEFAULT false,
	`isAvailable` boolean NOT NULL DEFAULT true,
	`profileCompleteness` int DEFAULT 0,
	`rating` decimal(3,2) DEFAULT '0.00',
	`totalAssignments` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workers_id` PRIMARY KEY(`id`),
	CONSTRAINT `workers_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `workers_nafathId_unique` UNIQUE(`nafathId`),
	CONSTRAINT `workers_iqamaNumber_unique` UNIQUE(`iqamaNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('worker','company_admin','sponsor','regulator','super_admin') NOT NULL DEFAULT 'worker';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX `date_idx` ON `analyticsSnapshots` (`snapshotDate`);--> statement-breakpoint
CREATE INDEX `metric_idx` ON `analyticsSnapshots` (`metricType`);--> statement-breakpoint
CREATE INDEX `sector_idx` ON `analyticsSnapshots` (`sector`);--> statement-breakpoint
CREATE INDEX `assignment_idx` ON `approvals` (`assignmentId`);--> statement-breakpoint
CREATE INDEX `sponsor_idx` ON `approvals` (`sponsorCompanyId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `approvals` (`status`);--> statement-breakpoint
CREATE INDEX `job_idx` ON `assignments` (`jobId`);--> statement-breakpoint
CREATE INDEX `worker_idx` ON `assignments` (`workerId`);--> statement-breakpoint
CREATE INDEX `company_idx` ON `assignments` (`companyId`);--> statement-breakpoint
CREATE INDEX `sponsor_idx` ON `assignments` (`sponsorCompanyId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `assignments` (`status`);--> statement-breakpoint
CREATE INDEX `payment_idx` ON `assignments` (`paymentStatus`);--> statement-breakpoint
CREATE INDEX `entity_idx` ON `auditLogs` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `performed_by_idx` ON `auditLogs` (`performedById`);--> statement-breakpoint
CREATE INDEX `timestamp_idx` ON `auditLogs` (`timestamp`);--> statement-breakpoint
CREATE INDEX `qiwa_idx` ON `companies` (`qiwaId`);--> statement-breakpoint
CREATE INDEX `sector_idx` ON `companies` (`sector`);--> statement-breakpoint
CREATE INDEX `nitaqat_idx` ON `companies` (`nitaqatStatus`);--> statement-breakpoint
CREATE INDEX `company_idx` ON `companyAdmins` (`companyId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `companyAdmins` (`userId`);--> statement-breakpoint
CREATE INDEX `assignment_idx` ON `complianceChecks` (`assignmentId`);--> statement-breakpoint
CREATE INDEX `check_type_idx` ON `complianceChecks` (`checkType`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `complianceChecks` (`status`);--> statement-breakpoint
CREATE INDEX `company_idx` ON `jobs` (`companyId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `jobs` (`status`);--> statement-breakpoint
CREATE INDEX `sector_idx` ON `jobs` (`sector`);--> statement-breakpoint
CREATE INDEX `start_date_idx` ON `jobs` (`startDate`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `is_read_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `assignment_idx` ON `transactions` (`assignmentId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `transactions` (`status`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `transactions` (`type`);--> statement-breakpoint
CREATE INDEX `from_company_idx` ON `transactions` (`fromCompanyId`);--> statement-breakpoint
CREATE INDEX `to_worker_idx` ON `transactions` (`toWorkerId`);--> statement-breakpoint
CREATE INDEX `worker_idx` ON `workerAvailability` (`workerId`);--> statement-breakpoint
CREATE INDEX `day_idx` ON `workerAvailability` (`dayOfWeek`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `workers` (`userId`);--> statement-breakpoint
CREATE INDEX `sponsor_idx` ON `workers` (`sponsorCompanyId`);--> statement-breakpoint
CREATE INDEX `skill_idx` ON `workers` (`primarySkill`);--> statement-breakpoint
CREATE INDEX `availability_idx` ON `workers` (`isAvailable`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);