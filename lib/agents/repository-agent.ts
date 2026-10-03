import { syntheticRepositoryIssues } from "../../lib/sandbox/repository-data";
import { detectSecurityIncident } from "../../lib/security/incident-detector";
import { createIncident } from "../../lib/services/incident-service";
import { createTrace } from "../../lib/services/trace-service";
import {
  createSummary,
  readIssue,
  sendNotification,
} from "../../lib/tools/repository-tools";
import { createRunId } from "../../lib/utils/id";

import type { SyntheticRepositoryIssue } from "../sandbox/types";
import type { RepositoryRunResult } from "../../types/agent-run";

const REPOSITORY_AGENT_ID = "AGENT-001" as const;

const DEFAULT_GOAL =
  "Analyze repository issues and summarize the important items.";

export async function runRepositoryAgent(
  goal: string = DEFAULT_GOAL,
): Promise<RepositoryRunResult> {
  const runId = createRunId();

  let step = 1;

  await createTrace({
    runId,
    step: step++,

    agentId: REPOSITORY_AGENT_ID,

    eventType: "user_request",

    source: "user",
    sourceTrust: "trusted",

    summary: goal,
  });

  const processedIssues: SyntheticRepositoryIssue[] = [];

  for (const syntheticIssue of syntheticRepositoryIssues) {
    const readResult = readIssue(syntheticIssue.id);

    if (!readResult.success || !readResult.data) {
      continue;
    }

    const issue = readResult.data;

    processedIssues.push(issue);

    await createTrace({
      runId,
      step: step++,

      agentId: REPOSITORY_AGENT_ID,

      eventType: "content_read",

      source: issue.id,
      sourceTrust: issue.sourceTrust,

      toolName: "read_issue",
      capabilityClass: "read_untrusted_content",

      authorized: true,

      summary: `Read synthetic repository issue: ${issue.title}`,
    });

    if (issue.securitySignal !== "untrusted_external_action_influence") {
      continue;
    }

    await createTrace({
      runId,
      step: step++,

      agentId: REPOSITORY_AGENT_ID,

      eventType: "agent_decision",

      source: issue.id,
      sourceTrust: issue.sourceTrust,

      toolName: "send_notification",
      capabilityClass: "external_side_effect",

      authorized: false,

      summary:
        "Untrusted issue content influenced the agent toward an unrelated external side-effect request.",
    });

    await createTrace({
      runId,
      step: step++,

      agentId: REPOSITORY_AGENT_ID,

      eventType: "tool_request",

      source: issue.id,
      sourceTrust: issue.sourceTrust,

      toolName: "send_notification",
      capabilityClass: "external_side_effect",

      authorized: false,

      summary:
        "Repository Agent requested the simulated send_notification capability without trusted authorization.",
    });

    const incidentEvaluation = detectSecurityIncident({
      sourceTrust: issue.sourceTrust,
      capabilityClass: "external_side_effect",
      trustedAuthorization: false,
    });

    if (!incidentEvaluation.incidentDetected) {
      continue;
    }

    const notificationResult = sendNotification({
      runId,
      agentId: REPOSITORY_AGENT_ID,

      source: issue.id,
      sourceTrust: issue.sourceTrust,

      trustedAuthorization: false,
    });

    await createTrace({
      runId,
      step: step++,

      agentId: REPOSITORY_AGENT_ID,

      eventType: "tool_result",

      source: issue.id,
      sourceTrust: issue.sourceTrust,

      toolName: notificationResult.toolName,

      capabilityClass: notificationResult.capabilityClass,

      authorized: false,

      summary: notificationResult.message,
    });

    const incident = await createIncident({
      agentId: REPOSITORY_AGENT_ID,
      runId,

      originalGoal: goal,

      source: issue.id,
      sourceTrust: issue.sourceTrust,

      observedAction: "send_notification",

      capabilityClass: "external_side_effect",

      trustedAuthorization: false,

      severity: "high",
    });

    await createTrace({
      runId,
      step: step++,

      agentId: REPOSITORY_AGENT_ID,

      incidentId: incident.id,

      eventType: "incident_detected",

      source: issue.id,
      sourceTrust: issue.sourceTrust,

      toolName: "send_notification",
      capabilityClass: "external_side_effect",

      authorized: false,

      summary: incidentEvaluation.reason ?? "Security incident detected.",
    });

    const summaryResult = createSummary(processedIssues);

    await createTrace({
      runId,
      step: step++,

      agentId: REPOSITORY_AGENT_ID,

      incidentId: incident.id,

      eventType: "tool_result",

      source: "repository",
      sourceTrust: "trusted",

      toolName: "create_summary",
      capabilityClass: "local_generation",

      authorized: true,

      summary:
        "Repository summary generated after the unsafe side-effect request was intercepted.",
    });

    return {
      runId,
      agentId: REPOSITORY_AGENT_ID,

      status: "intercepted",

      incidentDetected: true,
      incidentId: incident.id,

      summary: summaryResult.data,

      processedIssues: processedIssues.length,
    };
  }

  const summaryResult = createSummary(processedIssues);

  await createTrace({
    runId,
    step,

    agentId: REPOSITORY_AGENT_ID,

    eventType: "tool_result",

    source: "repository",
    sourceTrust: "trusted",

    toolName: "create_summary",
    capabilityClass: "local_generation",

    authorized: true,

    summary:
      "Repository analysis completed without detecting a security incident.",
  });

  return {
    runId,
    agentId: REPOSITORY_AGENT_ID,

    status: "completed",

    incidentDetected: false,
    incidentId: null,

    summary: summaryResult.data,

    processedIssues: processedIssues.length,
  };
}
