CREATE TABLE `agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`domain` text NOT NULL,
	`description` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `capabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`agent_id` text NOT NULL,
	`tool_name` text NOT NULL,
	`capability_class` text NOT NULL,
	`risk_level` text NOT NULL,
	`default_source_trust` text NOT NULL,
	`requires_authorization` integer DEFAULT false NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capability_agent_tool_unique` ON `capabilities` (`agent_id`,`tool_name`);--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` text PRIMARY KEY NOT NULL,
	`agent_id` text NOT NULL,
	`run_id` text NOT NULL,
	`original_goal` text NOT NULL,
	`source` text NOT NULL,
	`source_trust` text NOT NULL,
	`observed_action` text NOT NULL,
	`capability_class` text NOT NULL,
	`trusted_authorization` integer DEFAULT false NOT NULL,
	`severity` text NOT NULL,
	`status` text DEFAULT 'detected' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `incident_run_unique` ON `incidents` (`run_id`);--> statement-breakpoint
CREATE TABLE `invariants` (
	`id` text PRIMARY KEY NOT NULL,
	`incident_id` text NOT NULL,
	`source_trust` text NOT NULL,
	`influence` text NOT NULL,
	`action_class` text NOT NULL,
	`authorization_requirement` text NOT NULL,
	`constraint` text NOT NULL,
	`human_description` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `policies` (
	`id` text PRIMARY KEY NOT NULL,
	`invariant_id` text NOT NULL,
	`transfer_id` text NOT NULL,
	`target_agent_id` text NOT NULL,
	`target_capability` text NOT NULL,
	`source_trust` text NOT NULL,
	`trusted_authorization` integer NOT NULL,
	`effect` text NOT NULL,
	`status` text DEFAULT 'inactive' NOT NULL,
	`created_at` integer NOT NULL,
	`activated_at` integer,
	FOREIGN KEY (`invariant_id`) REFERENCES `invariants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`transfer_id`) REFERENCES `transfers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`target_agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `policy_transfer_unique` ON `policies` (`transfer_id`);--> statement-breakpoint
CREATE TABLE `traces` (
	`id` text PRIMARY KEY NOT NULL,
	`incident_id` text,
	`run_id` text NOT NULL,
	`step` integer NOT NULL,
	`agent_id` text NOT NULL,
	`event_type` text NOT NULL,
	`source` text,
	`source_trust` text DEFAULT 'unknown' NOT NULL,
	`tool_name` text,
	`capability_class` text,
	`authorized` integer,
	`summary` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`invariant_id` text NOT NULL,
	`source_agent_id` text NOT NULL,
	`target_agent_id` text NOT NULL,
	`target_tool` text NOT NULL,
	`mapping_confidence` real NOT NULL,
	`security_score` real,
	`utility_score` real,
	`status` text DEFAULT 'mapped' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`invariant_id`) REFERENCES `invariants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`source_agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `validation_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`transfer_id` text NOT NULL,
	`scenario_id` text NOT NULL,
	`type` text NOT NULL,
	`expected_decision` text NOT NULL,
	`actual_decision` text NOT NULL,
	`passed` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`transfer_id`) REFERENCES `transfers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `validation_transfer_scenario_unique` ON `validation_runs` (`transfer_id`,`scenario_id`);