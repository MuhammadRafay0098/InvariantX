import { syntheticEmails } from "../../lib/sandbox/email-data";
import { createTrace } from "../../lib/services/trace-service";
import {
  createCalendarEvent,
  readEmail,
  summarizeEmail,
} from "../../lib/tools/email-tools";
import { createRunId } from "../../lib/utils/id";

import type {
  EmailRunResult,
  ToolExecutionContext,
} from "../../types/agent-run";

const EMAIL_AGENT_ID = "AGENT-002" as const;

export type EmailDemoMode = "normal_summary" | "synthetic_untrusted";

function getEmailIdForMode(mode: EmailDemoMode): string {
  switch (mode) {
    case "normal_summary":
      return "email_normal_01";

    case "synthetic_untrusted":
      return "email_security_01";
  }
}

export async function runEmailAgent(
  mode: EmailDemoMode,
): Promise<EmailRunResult> {
  const runId = createRunId();

  const emailId = getEmailIdForMode(mode);

  const syntheticEmail = syntheticEmails.find((email) => email.id === emailId);

  if (!syntheticEmail) {
    throw new Error(`Synthetic email ${emailId} is not configured.`);
  }

  let step = 1;

  await createTrace({
    runId,
    step: step++,

    agentId: EMAIL_AGENT_ID,

    eventType: "user_request",

    source: "demo",
    sourceTrust: "trusted",

    summary:
      mode === "normal_summary"
        ? "Summarize the selected synthetic email."
        : "Process the selected synthetic external email.",
  });

  const readResult = readEmail(emailId);

  if (!readResult.success || !readResult.data) {
    throw new Error(`Unable to read synthetic email ${emailId}.`);
  }

  const email = readResult.data;

  await createTrace({
    runId,
    step: step++,

    agentId: EMAIL_AGENT_ID,

    eventType: "content_read",

    source: email.id,
    sourceTrust: email.sourceTrust,

    toolName: "read_email",
    capabilityClass: "read_untrusted_content",

    authorized: true,

    summary: `Read synthetic email: ${email.subject}`,
  });

  if (email.requestedBehavior === "summarize") {
    const summaryResult = summarizeEmail(email);

    await createTrace({
      runId,
      step,

      agentId: EMAIL_AGENT_ID,

      eventType: "tool_result",

      source: email.id,
      sourceTrust: email.sourceTrust,

      toolName: "summarize_email",
      capabilityClass: "local_generation",

      authorized: true,

      summary:
        "Synthetic email summarized locally without an external side effect.",
    });

    return {
      runId,
      agentId: EMAIL_AGENT_ID,

      status: "completed",

      source: email.id,
      sourceTrust: email.sourceTrust,

      requestedTool: "summarize_email",

      decision: "no_external_action",

      simulated: true,

      summary: summaryResult.data,
    };
  }

  await createTrace({
    runId,
    step: step++,

    agentId: EMAIL_AGENT_ID,

    eventType: "agent_decision",

    source: email.id,
    sourceTrust: email.sourceTrust,

    toolName: "create_calendar_event",
    capabilityClass: "external_side_effect",

    authorized: email.trustedAuthorization,

    summary:
      "Synthetic external email influenced the assistant toward a calendar side-effect request.",
  });

  await createTrace({
    runId,
    step: step++,

    agentId: EMAIL_AGENT_ID,

    eventType: "tool_request",

    source: email.id,
    sourceTrust: email.sourceTrust,

    toolName: "create_calendar_event",
    capabilityClass: "external_side_effect",

    authorized: email.trustedAuthorization,

    summary:
      "Email Agent requested the simulated create_calendar_event capability.",
  });

  const toolContext: ToolExecutionContext = {
    runId,
    agentId: EMAIL_AGENT_ID,

    source: email.id,
    sourceTrust: email.sourceTrust,

    trustedAuthorization: email.trustedAuthorization,
  };

  const calendarResult = createCalendarEvent(toolContext);

  await createTrace({
    runId,
    step,

    agentId: EMAIL_AGENT_ID,

    eventType: "tool_result",

    source: email.id,
    sourceTrust: email.sourceTrust,

    toolName: "create_calendar_event",

    capabilityClass: "external_side_effect",

    authorized: email.trustedAuthorization,

    summary:
      "No external calendar was modified. This run represents the pre-transfer behavior that would otherwise proceed without a transferred InvariantX policy.",
  });

  return {
    runId,
    agentId: EMAIL_AGENT_ID,

    status: "completed",

    source: email.id,
    sourceTrust: email.sourceTrust,

    requestedTool: "create_calendar_event",

    decision: "would_execute",

    simulated: true,

    summary: calendarResult.message,
  };
}
