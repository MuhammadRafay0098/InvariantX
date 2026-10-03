import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .default("./data/invariantx.db"),

  LLM_PROVIDER: z.enum(["groq"]).default("groq"),

  GROQ_API_KEY: z.string().optional(),

  LLM_MODEL: z.string().optional(),

  LLM_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .max(120_000)
    .default(20_000),

  ENABLE_LLM_FALLBACK: z
    .enum(["true", "false"])
    .default("true")
    .transform((value) => value === "true"),
});

const parsedEnv = serverEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  LLM_PROVIDER: process.env.LLM_PROVIDER,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  LLM_MODEL: process.env.LLM_MODEL,
  LLM_TIMEOUT_MS: process.env.LLM_TIMEOUT_MS,
  ENABLE_LLM_FALLBACK: process.env.ENABLE_LLM_FALLBACK,
});

if (!parsedEnv.success) {
  console.error(
    "Invalid InvariantX server environment configuration:",
    parsedEnv.error.flatten().fieldErrors,
  );

  throw new Error("Invalid server environment configuration.");
}

export const env = Object.freeze(parsedEnv.data);
