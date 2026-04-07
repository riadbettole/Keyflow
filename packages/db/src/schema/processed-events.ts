import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const processedEvents = pgTable('processed_events', {
	id: text('id').primaryKey(), // Stripe event ID
	processedAt: timestamp('processed_at').defaultNow().notNull(),
})
