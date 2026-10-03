import { db } from "./client";
import {
  incidents,
  invariants,
  policies,
  traces,
  transfers,
  validationRuns,
} from "./schema";

export async function resetDemoEnvironment(): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(validationRuns);
    await tx.delete(policies);
    await tx.delete(transfers);
    await tx.delete(invariants);
    await tx.delete(traces);
    await tx.delete(incidents);
  });
}