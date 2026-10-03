import { desc, eq } from "drizzle-orm";

import { db } from "../db/client";
import {
  agents,
  incidents,
  invariants,
  policies,
  transfers,
  validationRuns,
} from "../db/schema";

export async function getDashboardData() {
  const [
    agentRows,
    incidentRows,
    invariantRows,
    transferRows,
    policyRows,
    validationRows,
  ] = await Promise.all([
    db.select().from(agents),
    db.select().from(incidents).orderBy(desc(incidents.createdAt)),
    db.select().from(invariants).orderBy(desc(invariants.createdAt)),
    db.select().from(transfers).orderBy(desc(transfers.createdAt)),
    db.select().from(policies),
    db.select().from(validationRuns),
  ]);

  const activePolicies = policyRows.filter(
    (policy) => policy.status === "active",
  ).length;

  const passedValidations = validationRows.filter((run) => run.passed).length;

  return {
    counts: {
      agents: agentRows.length,
      incidents: incidentRows.length,
      invariants: invariantRows.length,
      transfers: transferRows.length,
      activePolicies,
    },
    validation: {
      passed: passedValidations,
      total: validationRows.length,
    },
    recent: {
      incidents: incidentRows.slice(0, 5),
      invariants: invariantRows.slice(0, 5),
      transfers: transferRows.slice(0, 5),
    },
  };
}

export async function getAgents() {
  return db.select().from(agents);
}

export async function getTransferDetails(transferId: string) {
  const [transfer] = await db
    .select()
    .from(transfers)
    .where(eq(transfers.id, transferId))
    .limit(1);

  if (!transfer) {
    return null;
  }

  const [policyRow, runs] = await Promise.all([
    db
      .select()
      .from(policies)
      .where(eq(policies.transferId, transferId))
      .limit(1),

    db
      .select()
      .from(validationRuns)
      .where(eq(validationRuns.transferId, transferId)),
  ]);

  const rawPolicy = policyRow[0] ?? null;

  const policy = rawPolicy
    ? {
        ...rawPolicy,
        conditions: {
          sourceTrust: rawPolicy.sourceTrust,
          trustedAuthorization: rawPolicy.trustedAuthorization,
        },
      }
    : null;

  return {
    transfer,
    policy,
    validationRuns: runs,
  };
}
