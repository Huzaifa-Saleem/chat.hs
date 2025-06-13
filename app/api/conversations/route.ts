import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/config/db";
import { users, conversations } from "@/config/db/schema";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json([], { status: 401 });
    }

    // Find the user in our database
    const userData = await db.query.users.findFirst({
      where: eq(users.clerkId, user.id),
    });

    if (!userData) {
      return NextResponse.json([], { status: 401 });
    }

    // Get all conversations for this user
    const userConversations = await db.query.conversations.findMany({
      where: eq(conversations.userId, userData.id),
      orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
    });

    return NextResponse.json(userConversations, { status: 200 });
  } catch (error) {
    console.error("[CONVERSATIONS_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
