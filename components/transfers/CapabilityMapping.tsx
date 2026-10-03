import {
  ArrowRight,
  CalendarPlus,
  GitBranch,
  Network,
  Send,
} from "lucide-react";

interface CapabilityMappingProps {
  targetTool: string;
  confidence: number;
}

function confidencePercentage(confidence: number) {
  return Math.round(confidence * 100);
}

export default function CapabilityMapping({
  targetTool,
  confidence,
}: CapabilityMappingProps) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.025] p-4 sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.045] blur-[80px] sm:block" />

      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-200/70">
              <Network className="size-3.5" />
              Semantic Capability Bridge
            </div>

            <p className="mt-2 text-xs text-zinc-500">
              Different tools. Equivalent security semantics.
            </p>
          </div>

          <div className="rounded-full border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-1.5">
            <span className="font-mono text-[10px] text-cyan-100">
              {confidencePercentage(confidence)}% mapping confidence
            </span>
          </div>
        </div>

        <div className="mt-6 grid min-w-0 items-stretch gap-3 md:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
          <MappingNode
            icon={Send}
            eyebrow="Source capability"
            title="send_notification"
            detail="Repository Assistant"
          />

          <MappingArrow />

          <MappingNode
            icon={Network}
            eyebrow="Semantic class"
            title="EXTERNAL_SIDE_EFFECT"
            detail="Transferable abstraction"
            highlighted
          />

          <MappingArrow />

          <MappingNode
            icon={CalendarPlus}
            eyebrow="Target capability"
            title={targetTool}
            detail="Email Calendar Assistant"
          />
        </div>

        <div className="mt-3 grid min-w-0 items-stretch gap-3 md:grid-cols-3 lg:mt-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4">
          <MappingNode
            icon={GitBranch}
            eyebrow="Observed source"
            title="Repository issue"
            detail="Untrusted content"
          />

          <MappingArrow />

          <MappingNode
            icon={Network}
            eyebrow="Trust abstraction"
            title="UNTRUSTED_SOURCE"
            detail="Source-independent semantics"
            highlighted
          />

          <MappingArrow />

          <MappingNode
            icon={CalendarPlus}
            eyebrow="Target source"
            title="External email"
            detail="Untrusted content"
          />
        </div>
      </div>
    </div>
  );
}

interface MappingNodeProps {
  icon: typeof Network;
  eyebrow: string;
  title: string;
  detail: string;
  highlighted?: boolean;
}

function MappingNode({
  icon: Icon,
  eyebrow,
  title,
  detail,
  highlighted = false,
}: MappingNodeProps) {
  return (
    <div
      className={[
        "min-w-0 rounded-2xl border p-4",
        highlighted
          ? "border-cyan-400/15 bg-cyan-400/[0.055]"
          : "border-white/[0.06] bg-black/20",
      ].join(" ")}
    >
      <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.035]">
        <Icon
          className={[
            "size-3.5",
            highlighted ? "text-cyan-200" : "text-zinc-500",
          ].join(" ")}
        />
      </div>

      <p className="mt-4 text-[9px] font-medium uppercase tracking-[0.16em] text-zinc-600">
        {eyebrow}
      </p>

      <p
        className={[
          "mt-1.5 [overflow-wrap:anywhere] font-mono text-xs",
          highlighted ? "text-cyan-100" : "text-zinc-300",
        ].join(" ")}
      >
        {title}
      </p>

      <p className="mt-1 text-[10px] text-zinc-600">{detail}</p>
    </div>
  );
}

function MappingArrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <ArrowRight className="size-4 text-zinc-700" />
    </div>
  );
}
