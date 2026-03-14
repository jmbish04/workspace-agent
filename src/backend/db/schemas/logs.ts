import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Logs table
 * Stores system health and operational logs
 */
export const logs = sqliteTable('logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  level: text('level').notNull(), // 'info' | 'warn' | 'error' | 'debug'
  module: text('module').notNull(), // e.g., 'agent', 'api', 'db'
  message: text('message').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});
