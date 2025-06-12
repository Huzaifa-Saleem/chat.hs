import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { users } from "@/config/db/schema";
import { db } from "@/config/db";
import { verifyWebhook, UserWebhookEvent } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as UserWebhookEvent;

    const user = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created" && "email_addresses" in user) {
      await db
        .insert(users)
        .values({
          clerkId: user.id!,
          email: user.email_addresses[0].email_address,
          firstName: user.first_name,
          lastName: user.last_name,
          imageUrl: user.image_url,
        })
        .onConflictDoNothing();
    } else if (eventType === "user.updated" && "email_addresses" in user) {
      await db
        .update(users)
        .set({
          email: user.email_addresses[0].email_address,
          firstName: user.first_name,
          lastName: user.last_name,
          imageUrl: user.image_url,
        })
        .where(eq(users.clerkId, user.id!));
    } else if (eventType === "user.deleted") {
      await db.delete(users).where(eq(users.clerkId, user.id!));
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[ClerkWebhookError]", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
