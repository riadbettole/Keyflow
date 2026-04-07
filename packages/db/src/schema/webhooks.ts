import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const webhooks = pgTable('webhooks', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull(),
	url: text('url').notNull(),
	secret: text('secret').notNull(), // HMAC signing secret
	events: text('events').notNull(), // JSON array of event types
	enabled: boolean('enabled').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Webhook = typeof webhooks.$inferSelect
export type NewWebhook = typeof webhooks.$inferInsert
