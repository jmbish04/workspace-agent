import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Transcripts table
 * Stores chat session metadata
 */
export const transcripts = sqliteTable("transcripts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

/**
 * Messages table
 * Stores individual messages within a transcript
 */
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  transcriptId: text("transcript_id")
    .notNull()
    .references(() => transcripts.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
  content: text("content").notNull(),
  toolCalls: text("tool_calls"), // JSON string of tool calls
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
