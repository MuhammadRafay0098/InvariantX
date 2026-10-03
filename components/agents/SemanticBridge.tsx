"use client";

import {
  ArrowRight,
  BellRing,
  CalendarPlus2,
  Network,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

interface SemanticBridgeProps {
  sourceTool: string | null;
  targetTool: string | null;
}

export default function SemanticBridge({
  sourceTool,
  targetTool,
}: SemanticBridgeProps) {
  if (!sourceTool || !targetTool) {
    return null;
  }

  return (
    <section className="relative min-w-0 overflow-hidden rounded-3xl border border-cyan-400/10 bg-[#070a10]/75 p-4 backdrop-blur-md sm:p-6 sm:backdrop-blur-lg">
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-20 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.04] blur-[60px] sm:block" />

      <div className="relative min-w-0">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Network className="size-3.5 text-cyan-300" />

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-200/70">
                Cross-agent semantic bridge
              </p>
            </div>

            <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-white">
              Different tools. Equivalent security semantics.
            </h2>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500">
              InvariantX transfers the capability meaning rather than matching
              literal tool names or attack signatures.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.055] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-emerald-200">
            <ShieldCheck className="size-3" />
            Semantic equivalence
          </div>
        </div>

        <div className="mt-6 grid min-w-0 items-center gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <BridgeNode
            icon={BellRing}
            eyebrow="Repository Assistant"
            tool={sourceTool}
            side="source"
          />

          <div className="relative hidden w-28 items-center justify-center lg:flex">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-cyan-400/10 via-cyan-300/60 to-violet-400/10" />

            <motion.div
              className="relative z-10 flex size-9 items-center justify-center rounded-full border border-cyan-300/20 bg-[#071016] shadow-[0_0_30px_rgba(34,211,238,0.12)]"
              animate={{
                scale: [1, 1.06, 1],
              }}
              transition={{
                duration: 2.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="size-3.5 text-cyan-200" />
            </motion.div>
          </div>

          <div className="flex items-center justify-center lg:hidden">
            <ArrowRight className="size-4 rotate-90 text-cyan-300/60" />
          </div>

          <BridgeNode
            icon={CalendarPlus2}
            eyebrow="Email Calendar Assistant"
            tool={targetTool}
            side="target"
          />
        </div>

        <div className="mt-4 flex items-center justify-center">
          <span className="max-w-full rounded-xl border border-white/[0.06] bg-black/30 px-4 py-2 text-center [overflow-wrap:anywhere] font-mono text-[10px] leading-4 text-cyan-100/80">
            EXTERNAL_SIDE_EFFECT
          </span>
        </div>
      </div>
    </section>
  );
}

interface BridgeNodeProps {
  icon: typeof BellRing;
  eyebrow: string;
  tool: string;
  side: "source" | "target";
}

function BridgeNode({ icon: Icon, eyebrow, tool, side }: BridgeNodeProps) {
  const source = side === "source";

  return (
    <div
      className={[
        "min-w-0 rounded-2xl border p-4",
        source
          ? "border-cyan-400/10 bg-cyan-400/[0.025]"
          : "border-violet-400/10 bg-violet-400/[0.025]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex size-9 items-center justify-center rounded-xl border",
            source
              ? "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200"
              : "border-violet-400/15 bg-violet-400/[0.06] text-violet-200",
          ].join(" ")}
        >
          <Icon className="size-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.14em] text-zinc-600">
            {eyebrow}
          </p>

          <p className="mt-1 [overflow-wrap:anywhere] font-mono text-xs text-zinc-200">
            {tool}
          </p>
        </div>
      </div>
    </div>
  );
}
