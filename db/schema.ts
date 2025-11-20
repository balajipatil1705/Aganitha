import { pgTable, serial, text, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 8 }).notNull(),
  target: text('target').notNull(),
  clicks: integer('clicks').notNull().default(0),
  created_at: timestamp('created_at').notNull().defaultNow(),
  last_clicked: timestamp('last_clicked'),
});
