import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
