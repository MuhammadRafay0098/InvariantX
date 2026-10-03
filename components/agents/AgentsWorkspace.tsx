"use client";

import { Bot, Network, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import AgentProfileCard from "./AgentProfileCard";
import AgentStats from "./AgentStats";
import SemanticBridge from "./SemanticBridge";

import type { AgentCapabilityView } from "./CapabilityGraph";

interface AgentView {
  id: string;
  name: string;
  domain: string;
  description: string;
  status: string;
}

interface AgentsWorkspaceProps {
  agents: AgentView[];
  capabilities: AgentCapabilityView[];
}

export default function AgentsWorkspace({
  agents,
  capabilities,
}: AgentsWorkspaceProps) {
  const repositoryAgent = agents.find((agent) => agent.id === "AGENT-001");
  const emailAgent = agents.find((agent) => agent.id === "AGENT-002");

  const repositoryCapabilities = capabilities.filter(
    (capability) => capability.agentId === "AGENT-001",
  );

  const emailCapabilities = capabilities.filter(
    (capability) => capability.agentId === "AGENT-002",
  );

  const sideEffectCapabilities = capabilities.filter(
    (capability) => capability.capabilityClass === "external_side_effect",
  );

  const authorizationCapabilities = capabilities.filter(
    (capability) => capability.requiresAuthorization,
  );

  const repositorySideEffect = repositoryCapabilities.find(
    (capability) => capability.capabilityClass === "external_side_effect",
  );

  const emailSideEffect = emailCapabilities.find(
    (capability) => capability.capabilityClass === "external_side_effect",
  );

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative min-w-0 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#080b11]/75 p-5 backdrop-blur-md sm:p-7 sm:backdrop-blur-lg"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 hidden size-72 rounded-full bg-cyan-400/[0.05] blur-[85px] sm:block" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 hidden size-64 rounded-full bg-violet-500/[0.04] blur-[85px] sm:block" />

        <div className="relative flex min-w-0 flex-col gap-5 sm:gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 max-w-3xl">
            <div className="flex items-center gap-2">
              <Bot className="size-3.5 text-cyan-300" />

              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-200/70">
                Agent topology
              </p>
            </div>

            <h1 className="mt-3 max-w-2xl text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
              Inspect the capabilities behind the security transfer.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
              Each agent exposes different tools, but InvariantX reasons across
              shared security semantics, trust boundaries, and authorization
              requirements.
            </p>
          </div>

          <div className="flex min-w-0 flex-wrap gap-2">
            <HeaderPill icon={ShieldCheck}>Deterministic boundaries</HeaderPill>

            <HeaderPill icon={Network}>Semantic mapping</HeaderPill>

            <HeaderPill icon={Sparkles}>Cross-agent transfer</HeaderPill>
          </div>
        </div>
      </motion.section>

      <AgentStats
        agentCount={agents.length}
        capabilityCount={capabilities.length}
        sideEffectCount={sideEffectCapabilities.length}
        authorizationCount={authorizationCapabilities.length}
      />

      <SemanticBridge
        sourceTool={repositorySideEffect?.toolName ?? null}
        targetTool={emailSideEffect?.toolName ?? null}
      />

      <section className="grid min-w-0 gap-5 xl:grid-cols-2">
        {repositoryAgent ? (
          <AgentProfileCard
            agent={repositoryAgent}
            capabilities={repositoryCapabilities}
            accent="cyan"
          />
        ) : null}

        {emailAgent ? (
          <AgentProfileCard
            agent={emailAgent}
            capabilities={emailCapabilities}
            accent="violet"
          />
        ) : null}
      </section>

      <section className="relative min-w-0 overflow-hidden rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] p-4 sm:p-5">
        <div className="pointer-events-none absolute right-0 top-0 hidden size-48 rounded-full bg-emerald-400/[0.045] blur-[65px] sm:block" />

        <div className="relative flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07]">
            <ShieldCheck className="size-4 text-emerald-200" />
          </div>

          <div>
            <p className="text-xs font-semibold text-white">
              Security semantics remain independent of tool names.
            </p>

            <p className="mt-1 max-w-3xl text-[11px] leading-5 text-zinc-500">
              The Repository Assistant and Email Calendar Assistant expose
              structurally different tools. Their external side-effect
              capabilities can still be governed by the same transferred
              invariant because the policy is bound to capability semantics,
              trust, and authorization rather than literal attack signatures.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface HeaderPillProps {
  icon: typeof ShieldCheck;
  children: React.ReactNode;
}

function HeaderPill({ icon: Icon, children }: HeaderPillProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-black/20 px-3 py-2 text-[10px] text-zinc-500">
      <Icon className="size-3 text-cyan-300/70" />
      {children}
    </div>
  );
}
