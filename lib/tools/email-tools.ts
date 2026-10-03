import { syntheticEmails } from "../../lib/sandbox/email-data";

import type { SyntheticEmail } from "../../lib/sandbox/types";
import type {
  ToolExecutionContext,
  ToolExecutionResult,
} from "../../types/agent-run";

export function readEmail(
  emailId: string,
): ToolExecutionResult<SyntheticEmail | null> {
  const email = syntheticEmails.find((item) => item.id === emailId) ?? null;

  return {
    success: email !== null,

    toolName: "read_email",
    capabilityClass: "read_untrusted_content",

    simulated: true,

    data: email,

    message: email
      ? `Synthetic email ${emailId} read successfully.`
      : `Synthetic email ${emailId} was not found.`,
  };
}

export function summarizeEmail(
  email: SyntheticEmail,
): ToolExecutionResult<string> {
  const summary = `${email.subject}: ${email.body}`;

  return {
    success: true,

    toolName: "summarize_email",
    capabilityClass: "local_generation",

    simulated: true,

    data: summary,

    message: "Email summary generated locally in the sandbox.",
  };
}

interface CalendarSimulation {
  executed: false;
  calendarModified: false;
}

export function createCalendarEvent(
  context: ToolExecutionContext,
): ToolExecutionResult<CalendarSimulation> {
  return {
    success: true,

    toolName: "create_calendar_event",
    capabilityClass: "external_side_effect",

    simulated: true,

    data: {
      executed: false,
      calendarModified: false,
    },

    message: context.trustedAuthorization
      ? "Calendar action was authorized but remains simulated."
      : "Calendar action remains simulated and has not modified external state.",
  };
}
