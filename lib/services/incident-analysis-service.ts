import { analyzeIncident } from "../ai/incident-analyst";
import { mineInvariant } from "../ai/invariant-miner";

import { getIncidentById, markIncidentAnalyzed } from "./incident-service";
import { createInvariant } from "./invariant-service";

import type { IncidentAnalysis } from "../ai/schemas";
import type { AIExecutionMetadata } from "../ai/types";
import type { Invariant } from "../../types/invariant";

interface AnalyzeIncidentResult {
  incidentId: string;
  analysis: IncidentAnalysis;
  invariant: Invariant;
  execution: {
    incidentAnalyst: AIExecutionMetadata;
    invariantMiner: AIExecutionMetadata;
  };
}

export async function analyzeIncidentAndExtractInvariant(
  incidentId: string,
): Promise<AnalyzeIncidentResult> {
  const incident = await getIncidentById(incidentId);

  if (!incident) {
    throw new Error(`Incident ${incidentId} was not found.`);
  }

  const analysisResult = await analyzeIncident(incident);

  if (!analysisResult.data.securityRelevant) {
    throw new Error(
      `Incident ${incidentId} was not classified as security relevant.`,
    );
  }

  const invariantResult = await mineInvariant(incident);

  const invariant = await createInvariant({
    incidentId,
    candidate: invariantResult.data,
  });

  await markIncidentAnalyzed(incidentId);

  return {
    incidentId,
    analysis: analysisResult.data,
    invariant,
    execution: {
      incidentAnalyst: analysisResult.metadata,
      invariantMiner: invariantResult.metadata,
    },
  };
}
