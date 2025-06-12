import {
  pgTable,
  text,
  timestamp,
  serial,
  jsonb,
  boolean,
  index,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table with proper indexing and constraints
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull().unique(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").default(true),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (users) => [
    index("users_email_idx").on(users.email),
    index("users_clerk_id_idx").on(users.clerkId),
  ]
);

// Conversations table to group messages
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    title: text("title"),
    model: text("model").notNull(),
    ipAddress: text("ip_address"),
    isArchived: boolean("is_archived").default(false),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (conversations) => [
    index("conversations_user_id_idx").on(conversations.userId),
    index("conversations_created_at_idx").on(conversations.createdAt),
  ]
);

// Messages table with proper relations
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id").references(() => conversations.id, {
      onDelete: "cascade",
    }),
    role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
    content: text("content").notNull(),
    tokens: integer("tokens"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (messages) => [
    index("messages_conversation_id_idx").on(messages.conversationId),
    index("messages_created_at_idx").on(messages.createdAt),
  ]
);

// Usage tracking table
export const usageTracking = pgTable(
  "usage_tracking",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    ipAddress: text("ip_address").notNull(),
    requestCount: integer("request_count").notNull().default(0),
    lastRequestAt: timestamp("last_request_at", {
      withTimezone: true,
    }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (usageTracking) => [
    index("usage_tracking_user_id_idx").on(usageTracking.userId),
    index("usage_tracking_ip_address_idx").on(usageTracking.ipAddress),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  conversations: many(conversations),
  usageTracking: many(usageTracking),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [conversations.userId],
      references: [users.id],
    }),
    messages: many(messages),
  })
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const usageTrackingRelations = relations(usageTracking, ({ one }) => ({
  user: one(users, {
    fields: [usageTracking.userId],
    references: [users.id],
  }),
}));
