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
  db.transaction((tx) => {
    tx.delete(validationRuns).run();
    tx.delete(policies).run();
    tx.delete(transfers).run();
    tx.delete(invariants).run();
    tx.delete(traces).run();
    tx.delete(incidents).run();
  });
}
