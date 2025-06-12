import { z } from "zod";
import PROVIDERS from "@/constants/models";

export const modelKeys = Object.keys(PROVIDERS) as [string, ...string[]];

export const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export const chatRequestSchema = z.object({
  model: z.enum(modelKeys),
  conversationId: z.string().uuid().optional(),
  messages: z.array(messageSchema),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type Message = z.infer<typeof messageSchema>;
