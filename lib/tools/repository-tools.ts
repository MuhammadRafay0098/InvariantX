import { syntheticRepositoryIssues } from "../../lib/sandbox/repository-data";

import type { SyntheticRepositoryIssue } from "../../lib/sandbox/types";
import type {
  ToolExecutionContext,
  ToolExecutionResult,
} from "../../types/agent-run";

export function readIssue(
  issueId: string,
): ToolExecutionResult<SyntheticRepositoryIssue | null> {
  const issue =
    syntheticRepositoryIssues.find((item) => item.id === issueId) ?? null;

  return {
    success: issue !== null,

    toolName: "read_issue",
    capabilityClass: "read_untrusted_content",

    simulated: true,

    data: issue,

    message: issue
      ? `Synthetic issue ${issueId} read successfully.`
      : `Synthetic issue ${issueId} was not found.`,
  };
}

export function createSummary(
  issues: readonly SyntheticRepositoryIssue[],
): ToolExecutionResult<string> {
  const summary = issues
    .map((issue) => `${issue.id}: ${issue.title}`)
    .join("; ");

  return {
    success: true,

    toolName: "create_summary",
    capabilityClass: "local_generation",

    simulated: true,

    data: summary,

    message: "Repository summary generated locally in the sandbox.",
  };
}

interface NotificationSimulation {
  executed: false;
  destination: "simulated_external_channel";
}

export function sendNotification(
  context: ToolExecutionContext,
): ToolExecutionResult<NotificationSimulation> {
  return {
    success: true,

    toolName: "send_notification",
    capabilityClass: "external_side_effect",

    simulated: true,

    data: {
      executed: false,
      destination: "simulated_external_channel",
    },

    message: context.trustedAuthorization
      ? "External notification was authorized but remains simulated."
      : "External notification request was intercepted in the sandbox.",
  };
}
