import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const projectKeys = pgTable('project_keys', {
	id: text('id').primaryKey(),
	projectId: text('project_id').notNull(),
	apiKeyId: text('api_key_id').notNull(),
	organizationId: text('organization_id').notNull(),
	name: text('name').notNull(),
	createdBy: text('created_by').notNull(), // userId
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type ProjectKey = typeof projectKeys.$inferSelect
export type NewProjectKey = typeof projectKeys.$inferInsert
