export const AI_MODULES = [
  "incident_analyst",
  "invariant_miner",
  "semantic_mapper",
  "validation_analyst",
] as const;

export type AIModule = (typeof AI_MODULES)[number];

export type AIExecutionMode = "live_llm" | "demo_fallback";

export interface AIExecutionMetadata {
  module: AIModule;
  mode: AIExecutionMode;
  provider: "groq";
  model: string;
}

export interface StructuredAIResult<T> {
  data: T;
  metadata: AIExecutionMetadata;
}
