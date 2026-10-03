import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const agents = sqliteTable("agents", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  domain: text("domain").notNull(),
  description: text("description").notNull(),

  status: text("status", {
    enum: ["active", "inactive"],
  })
    .notNull()
    .default("active"),

  createdAt: integer("created_at", {
    mode: "timestamp",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const capabilities = sqliteTable(
  "capabilities",
  {
    id: text("id").primaryKey(),

    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, {
        onDelete: "cascade",
      }),

    toolName: text("tool_name").notNull(),

    capabilityClass: text("capability_class", {
      enum: [
        "read_content",
        "read_untrusted_content",
        "local_generation",
        "external_side_effect",
      ],
    }).notNull(),

    riskLevel: text("risk_level", {
      enum: ["low", "medium", "high", "critical"],
    }).notNull(),

    defaultSourceTrust: text("default_source_trust", {
      enum: ["trusted", "untrusted", "unknown"],
    }).notNull(),

    requiresAuthorization: integer("requires_authorization", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

    description: text("description").notNull(),
  },
  (table) => [
    uniqueIndex("capability_agent_tool_unique").on(
      table.agentId,
      table.toolName,
    ),
  ],
);

export const incidents = sqliteTable(
  "incidents",
  {
    id: text("id").primaryKey(),

    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, {
        onDelete: "cascade",
      }),

    runId: text("run_id").notNull(),

    originalGoal: text("original_goal").notNull(),

    source: text("source").notNull(),

    sourceTrust: text("source_trust", {
      enum: ["trusted", "untrusted", "unknown"],
    }).notNull(),

    observedAction: text("observed_action").notNull(),

    capabilityClass: text("capability_class", {
      enum: [
        "read_content",
        "read_untrusted_content",
        "local_generation",
        "external_side_effect",
      ],
    }).notNull(),

    trustedAuthorization: integer("trusted_authorization", {
      mode: "boolean",
    })
      .notNull()
      .default(false),

    severity: text("severity", {
      enum: ["low", "medium", "high", "critical"],
    }).notNull(),

    status: text("status", {
      enum: ["detected", "analyzed", "resolved"],
    })
      .notNull()
      .default("detected"),

    createdAt: integer("created_at", {
      mode: "timestamp",
    })
      .notNull()
      .$defaultFn(() => new Date()),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [uniqueIndex("incident_run_unique").on(table.runId)],
);

export const traces = sqliteTable("traces", {
  id: text("id").primaryKey(),

  incidentId: text("incident_id").references(() => incidents.id, {
    onDelete: "set null",
  }),

  runId: text("run_id").notNull(),

  step: integer("step").notNull(),

  agentId: text("agent_id")
    .notNull()
    .references(() => agents.id, {
      onDelete: "cascade",
    }),

  eventType: text("event_type", {
    enum: [
      "user_request",
      "content_read",
      "agent_decision",
      "tool_request",
      "tool_result",
      "incident_detected",
      "policy_decision",
    ],
  }).notNull(),

  source: text("source"),

  sourceTrust: text("source_trust", {
    enum: ["trusted", "untrusted", "unknown"],
  })
    .notNull()
    .default("unknown"),

  toolName: text("tool_name"),

  capabilityClass: text("capability_class", {
    enum: [
      "read_content",
      "read_untrusted_content",
      "local_generation",
      "external_side_effect",
    ],
  }),

  authorized: integer("authorized", {
    mode: "boolean",
  }),

  summary: text("summary").notNull(),

  createdAt: integer("created_at", {
    mode: "timestamp",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const invariants = sqliteTable("invariants", {
  id: text("id").primaryKey(),

  incidentId: text("incident_id")
    .notNull()
    .references(() => incidents.id, {
      onDelete: "cascade",
    }),

  sourceTrust: text("source_trust", {
    enum: ["trusted", "untrusted", "unknown"],
  }).notNull(),

  influence: text("influence", {
    enum: ["agent_decision"],
  }).notNull(),

  actionClass: text("action_class", {
    enum: [
      "read_content",
      "read_untrusted_content",
      "local_generation",
      "external_side_effect",
    ],
  }).notNull(),

  authorizationRequirement: text("authorization_requirement", {
    enum: ["trusted_authorization_required"],
  }).notNull(),

  constraint: text("constraint", {
    enum: ["deny_or_require_approval"],
  }).notNull(),

  humanDescription: text("human_description").notNull(),

  status: text("status", {
    enum: ["active", "retired"],
  })
    .notNull()
    .default("active"),

  createdAt: integer("created_at", {
    mode: "timestamp",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const transfers = sqliteTable("transfers", {
  id: text("id").primaryKey(),

  invariantId: text("invariant_id")
    .notNull()
    .references(() => invariants.id, {
      onDelete: "cascade",
    }),

  sourceAgentId: text("source_agent_id")
    .notNull()
    .references(() => agents.id),

  targetAgentId: text("target_agent_id")
    .notNull()
    .references(() => agents.id),

  targetTool: text("target_tool").notNull(),

  mappingConfidence: real("mapping_confidence").notNull(),

  securityScore: real("security_score"),
  utilityScore: real("utility_score"),

  status: text("status", {
    enum: ["mapped", "validating", "ready_for_review", "approved", "rejected"],
  })
    .notNull()
    .default("mapped"),

  createdAt: integer("created_at", {
    mode: "timestamp",
  })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer("updated_at", {
    mode: "timestamp",
  })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const policies = sqliteTable(
  "policies",
  {
    id: text("id").primaryKey(),

    invariantId: text("invariant_id")
      .notNull()
      .references(() => invariants.id, {
        onDelete: "cascade",
      }),

    transferId: text("transfer_id")
      .notNull()
      .references(() => transfers.id, {
        onDelete: "cascade",
      }),

    targetAgentId: text("target_agent_id")
      .notNull()
      .references(() => agents.id),

    targetCapability: text("target_capability").notNull(),

    sourceTrust: text("source_trust", {
      enum: ["trusted", "untrusted", "unknown"],
    }).notNull(),

    trustedAuthorization: integer("trusted_authorization", {
      mode: "boolean",
    }).notNull(),

    effect: text("effect", {
      enum: ["allow", "require_approval", "block"],
    }).notNull(),

    status: text("status", {
      enum: ["inactive", "active"],
    })
      .notNull()
      .default("inactive"),

    createdAt: integer("created_at", {
      mode: "timestamp",
    })
      .notNull()
      .$defaultFn(() => new Date()),

    activatedAt: integer("activated_at", {
      mode: "timestamp",
    }),
  },
  (table) => [uniqueIndex("policy_transfer_unique").on(table.transferId)],
);

export const validationRuns = sqliteTable(
  "validation_runs",
  {
    id: text("id").primaryKey(),

    transferId: text("transfer_id")
      .notNull()
      .references(() => transfers.id, {
        onDelete: "cascade",
      }),

    scenarioId: text("scenario_id").notNull(),

    type: text("type", {
      enum: ["security", "utility"],
    }).notNull(),

    expectedDecision: text("expected_decision", {
      enum: ["allow", "require_approval", "block"],
    }).notNull(),

    actualDecision: text("actual_decision", {
      enum: ["allow", "require_approval", "block"],
    }).notNull(),

    passed: integer("passed", {
      mode: "boolean",
    }).notNull(),

    notes: text("notes"),

    createdAt: integer("created_at", {
      mode: "timestamp",
    })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("validation_transfer_scenario_unique").on(
      table.transferId,
      table.scenarioId,
    ),
  ],
);
