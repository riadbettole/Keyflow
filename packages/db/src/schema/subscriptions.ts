import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const subscriptions = pgTable('subscriptions', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull().unique(),
	stripeCustomerId: text('stripe_customer_id'),
	stripeSubscriptionId: text('stripe_subscription_id'),
	plan: text('plan').notNull().default('free'), // 'free' | 'pro'
	status: text('status').notNull().default('active'), // 'active' | 'cancelled' | 'past_due'
	currentPeriodEnd: timestamp('current_period_end'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
