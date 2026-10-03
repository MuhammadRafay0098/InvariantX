import {
  BellRing,
  CalendarPlus2,
  FileText,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { CapabilityClass, TrustLevel } from "../../types/agent";

interface CapabilityNodeProps {
  toolName: string;
  capabilityClass: CapabilityClass;
  sourceTrust: TrustLevel;
  requiresAuthorization: boolean;
  description: string;
}

function ToolIcon({ toolName }: { toolName: string }) {
  const className = "size-4";

  switch (toolName) {
    case "read_issue":
    case "read_file":
      return <FileText className={className} />;

    case "create_summary":
    case "summarize_email":
      return <Sparkles className={className} />;

    case "send_notification":
      return <BellRing className={className} />;

    case "read_email":
      return <Mail className={className} />;

    case "create_calendar_event":
      return <CalendarPlus2 className={className} />;

    default:
      return <ShieldCheck className={className} />;
  }
}

function getCapabilityTone(capabilityClass: CapabilityClass) {
  switch (capabilityClass) {
    case "external_side_effect":
      return {
        shell: "border-rose-400/15 bg-rose-400/[0.025]",
        icon: "border-rose-400/15 bg-rose-400/[0.07] text-rose-200",
        text: "text-rose-200",
      };

    case "read_untrusted_content":
      return {
        shell: "border-amber-400/10 bg-amber-400/[0.02]",
        icon: "border-amber-400/15 bg-amber-400/[0.06] text-amber-200",
        text: "text-amber-200",
      };

    case "local_generation":
      return {
        shell: "border-violet-400/10 bg-violet-400/[0.02]",
        icon: "border-violet-400/15 bg-violet-400/[0.06] text-violet-200",
        text: "text-violet-200",
      };

    default:
      return {
        shell: "border-cyan-400/10 bg-cyan-400/[0.02]",
        icon: "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200",
        text: "text-cyan-200",
      };
  }
}

export default function CapabilityNode({
  toolName,
  capabilityClass,
  sourceTrust,
  requiresAuthorization,
  description,
}: CapabilityNodeProps) {
  const tone = getCapabilityTone(capabilityClass);

  return (
    <article
      className={[
        "group relative min-w-0 overflow-hidden rounded-2xl border p-3.5 sm:p-4",
        "transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.025]",
        tone.shell,
      ].join(" ")}
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={[
            "flex size-9 shrink-0 items-center justify-center rounded-xl border",
            tone.icon,
          ].join(" ")}
        >
          <ToolIcon toolName={toolName} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="[overflow-wrap:anywhere] font-mono text-xs font-medium text-zinc-200">
                {toolName}
              </p>

              <p
                className={[
                  "mt-1 [overflow-wrap:anywhere] font-mono text-[9px] uppercase tracking-[0.12em]",
                  tone.text,
                ].join(" ")}
              >
                {capabilityClass}
              </p>
            </div>

            {requiresAuthorization ? (
              <span className="shrink-0 rounded-full border border-rose-400/15 bg-rose-400/[0.06] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-rose-200">
                Auth gate
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-[11px] leading-5 text-zinc-600">
            {description}
          </p>

          <div className="mt-3 flex min-w-0 flex-wrap gap-2">
            <span className="max-w-full rounded-lg border border-white/[0.06] bg-black/20 px-2 py-1 [overflow-wrap:anywhere] font-mono text-[9px] leading-4 text-zinc-600">
              trust: {sourceTrust}
            </span>

            <span className="max-w-full rounded-lg border border-white/[0.06] bg-black/20 px-2 py-1 [overflow-wrap:anywhere] font-mono text-[9px] leading-4 text-zinc-600">
              authorization:{" "}
              {requiresAuthorization ? "required" : "not required"}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
