import type { TrustLevel } from "../../types/agent";

export interface SyntheticRepositoryIssue {
  id: string;
  title: string;
  body: string;

  sourceTrust: TrustLevel;

  securitySignal: "none" | "untrusted_external_action_influence";
}

export interface SyntheticEmail {
  id: string;
  subject: string;
  body: string;

  sourceTrust: TrustLevel;

  requestedBehavior: "summarize" | "calendar_influence";

  trustedAuthorization: boolean;
}
