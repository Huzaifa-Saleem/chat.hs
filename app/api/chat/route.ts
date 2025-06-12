import { streamText } from "ai";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import PROVIDERS from "@/constants/models";
import { DEFAULT_MODEL } from "@/constants/models";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  users,
  conversations,
  messages,
  usageTracking,
} from "@/config/db/schema";
import { chatRequestSchema } from "@/lib/validations/chat";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const MAX_ANONYMOUS_REQUESTS = 10;

async function handleAnonymousUser(ipAddress: string) {
  const anonymousUsage = await db.query.usageTracking.findFirst({
    where: eq(usageTracking.ipAddress, ipAddress),
  });

  if (!anonymousUsage) {
    await db.insert(usageTracking).values({
      ipAddress,
      requestCount: 1,
    });
    return true;
  }

  if (anonymousUsage.requestCount >= MAX_ANONYMOUS_REQUESTS) {
    return false;
  }

  await db
    .update(usageTracking)
    .set({
      requestCount: anonymousUsage.requestCount + 1,
      lastRequestAt: new Date(),
    })
    .where(eq(usageTracking.ipAddress, ipAddress));
  return true;
}

async function getOrCreateConversation(
  userId: string | null,
  modelName: string,
  ipAddress: string,
  chatMessages: any[],
  conversationId?: string
) {
  if (conversationId) {
    const existingConversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, conversationId),
    });
    if (existingConversation) return existingConversation;
  }

  if (!userId) return null;

  const userData = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!userData) return null;

  const [newConversation] = await db
    .insert(conversations)
    .values({
      userId: userData.id,
      model: modelName,
      ipAddress,
      title: chatMessages[0]?.content?.slice(0, 50) || "New Conversation",
    })
    .returning();

  return newConversation;
}

async function saveMessages(conversationId: string, chatMessages: any[]) {
  const messagePromises = chatMessages.map(
    (msg: { role: "user" | "assistant" | "system"; content: string }) =>
      db.insert(messages).values({
        conversationId,
        role: msg.role,
        content: msg.content,
      })
  );
  await Promise.all(messagePromises);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { success, data } = chatRequestSchema.safeParse(body);

  if (!success) {
    return new Response("Invalid request data", { status: 400 });
  }

  const { messages: chatMessages, model: modelName, conversationId } = data;
  const user = await currentUser();
  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for") || "unknown";

  if (!user) {
    const canProceed = await handleAnonymousUser(ipAddress);
    if (!canProceed) {
      return new Response(
        "Request limit exceeded. Please sign in to continue.",
        { status: 429 }
      );
    }
  }

  const model = PROVIDERS[modelName as keyof typeof PROVIDERS] || DEFAULT_MODEL;
  const conversation = await getOrCreateConversation(
    user?.id ?? null,
    modelName,
    ipAddress,
    chatMessages,
    conversationId
  );

  if (conversation) {
    await saveMessages(conversation.id, chatMessages);
  }

  const result = streamText({
    model,
    messages: chatMessages,
  });

  return result.toDataStreamResponse();
}
