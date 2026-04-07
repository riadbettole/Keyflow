import type { ProjectKey, Webhook } from '@keyflow/db'
import { projectKeys, projects, subscriptions, webhooks } from '@keyflow/db'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { mongo } from '../../lib/mongo'
import { protectedProcedure, router } from '../init'
import { orgProcedure } from '../middleware'

export const settingsRouter = router({
	exportData: protectedProcedure.query(async ({ ctx }) => {
		const orgId = ctx.session?.activeOrganizationId ?? ''

		const [userProjects, userKeys, userWebhooks, auditLogs, usageLogs] = await Promise.all([
			ctx.db.query.projects.findMany({
				where: eq(projects.organizationId, orgId),
			}),
			ctx.db.query.projectKeys.findMany({
				where: eq(projectKeys.organizationId, orgId),
			}),
			ctx.db.query.webhooks.findMany({
				where: eq(webhooks.organizationId, orgId),
			}),
			mongo.collection('audit_logs').find({ organizationId: orgId }).toArray(),
			mongo.collection('usage_logs').find({ organizationId: orgId }).limit(1000).toArray(),
		])

		return {
			exportedAt: new Date().toISOString(),
			user: {
				id: ctx.user.id,
				name: ctx.user.name,
				email: ctx.user.email,
			},
			projects: userProjects,
			apiKeys: userKeys.map((k: ProjectKey) => ({
				id: k.id,
				name: k.name,
				projectId: k.projectId,
				createdAt: k.createdAt,
				createdBy: k.createdBy,
			})),
			webhooks: userWebhooks.map((w: Webhook) => ({
				id: w.id,
				url: w.url,
				events: w.events,
				enabled: w.enabled,
				createdAt: w.createdAt,
				secret: '[REDACTED]',
			})),
			auditLogs,
			usageLogs,
		}
	}),

	updateOrg: orgProcedure
		.input(z.object({ name: z.string().min(1).max(100) }))
		.mutation(async ({ ctx, input }) => {
			await auth.api.updateOrganization({
				body: {
					organizationId: ctx.organizationId,
					data: { name: input.name },
				},
				headers: new Headers({
					Authorization: `Bearer ${ctx.session.token}`,
				}),
			})
			return { success: true }
		}),

	deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
		const orgId = ctx.session?.activeOrganizationId ?? ''

		await ctx.db.delete(projectKeys).where(eq(projectKeys.organizationId, orgId))
		await ctx.db.delete(projects).where(eq(projects.organizationId, orgId))
		await ctx.db.delete(webhooks).where(eq(webhooks.organizationId, orgId))
		await ctx.db.delete(subscriptions).where(eq(subscriptions.organizationId, orgId))

		await ctx.mongo.collection('audit_logs').deleteMany({ organizationId: orgId })
		await ctx.mongo.collection('usage_logs').deleteMany({ organizationId: orgId })
		await ctx.mongo.collection('webhook_deliveries').deleteMany({ organizationId: orgId })

		return { success: true }
	}),
})
