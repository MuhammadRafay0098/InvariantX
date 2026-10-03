import Groq from "groq-sdk";
import type { ZodType } from "zod";

import { env } from "../../lib/env";
import type { AIModule, StructuredAIResult } from "./types";

const DEFAULT_MODEL = "openai/gpt-oss-120b";

const model = env.LLM_MODEL?.trim() || DEFAULT_MODEL;

let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: env.GROQ_API_KEY,
      timeout: env.LLM_TIMEOUT_MS,
    });
  }

  return groqClient;
}

interface StructuredCompletionOptions<T> {
  module: AIModule;
  systemPrompt: string;
  userPrompt: string;
  schema: ZodType<T>;
  fallback: T;
}

export async function runStructuredAI<T>(
  options: StructuredCompletionOptions<T>,
): Promise<StructuredAIResult<T>> {
  if (!env.GROQ_API_KEY) {
    if (!env.ENABLE_LLM_FALLBACK) {
      throw new Error("GROQ_API_KEY is missing and LLM fallback is disabled.");
    }

    return {
      data: options.schema.parse(options.fallback),
      metadata: {
        module: options.module,
        mode: "demo_fallback",
        provider: "groq",
        model,
      },
    };
  }

  try {
    const client = getGroqClient();

    const completion = await client.chat.completions.create({
      model,
      temperature: 0,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: options.systemPrompt,
        },
        {
          role: "user",
          content: options.userPrompt,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Groq returned an empty response.");
    }

    const parsedJson: unknown = JSON.parse(content);

    return {
      data: options.schema.parse(parsedJson),
      metadata: {
        module: options.module,
        mode: "live_llm",
        provider: "groq",
        model,
      },
    };
  } catch (error: unknown) {
    console.error("Groq live LLM request failed:", error);

    if (!env.ENABLE_LLM_FALLBACK) {
      throw error;
    }

    return {
      data: options.schema.parse(options.fallback),
      metadata: {
        module: options.module,
        mode: "demo_fallback",
        provider: "groq",
        model,
      },
    };
  }
}
