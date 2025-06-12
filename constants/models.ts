import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { deepseek } from "@ai-sdk/deepseek";

const PROVIDERS = {
  // Anthropic
  "claude-3-5-sonnet": anthropic("claude-3-5-sonnet-20240620"),
  "claude-3-7-sonnet": anthropic("claude-3-7-sonnet-20250219"),
  "claude-4-sonnet": anthropic("claude-4-sonnet-latest"),

  // Google
  "gemini-2.0-flash": google("gemini-2.0-flash-001"),
  "gemini-2.5-flash": google("gemini-2.5-flash-001"),

  // OpenAI
  "gpt-4o": openai("gpt-4o-mini"),
  "gpt-4o-mini": openai("gpt-4o-mini"),

  // DeepSeek
  "deepseek-r1": deepseek("deepseek-r1"),
};

export default PROVIDERS;

export const DEFAULT_MODEL = PROVIDERS["claude-3-5-sonnet"];
