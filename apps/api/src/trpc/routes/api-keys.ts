import { projectKeys, projects } from '@keyflow/db'
import { throwError } from '@keyflow/errors'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { audit } from '../../lib/audit'
import { auth } from '../../lib/auth'
import { router } from '../init'
import { orgProcedure } from '../middleware'

export const apiKeysRouter = router({
	create: orgProcedure
		.input(
			z.object({
				projectId: z.string(),
				name: z.string().min(1).max(100),
				expiresIn: z.number().optional(), // seconds
				rateLimitMax: z.number().default(1000),
				rateLimitTimeWindow: z.number().default(60 * 60 * 1000), // 1 hour in ms
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// verify project belongs to org
			const project = await ctx.db.query.projects.findFirst({
				where: and(
					eq(projects.id, input.projectId),
					eq(projects.organizationId, ctx.session.activeOrganizationId ?? ''),
				),
			})

			if (!project) throwError({ reason: 'NotFound', resource: 'project' })

			// create key via Better Auth
			const result = await auth.api.createApiKey({
				body: {
					configId: 'org-keys',
					name: input.name,
					organizationId: ctx.organizationId,
					expiresIn: input.expiresIn,
				},
				headers: new Headers({
					Authorization: `Bearer ${ctx.session.token}`,
				}),
			})

			await ctx.db.insert(projectKeys).values({
				id: crypto.randomUUID(),
				projectId: input.projectId,
				apiKeyId: result.id,
				organizationId: ctx.organizationId,
				name: input.name,
				createdBy: ctx.user.id,
			})

			await audit({
				userId: ctx.user.id,
				organizationId: ctx.organizationId,
				event: {
					action: 'api_key.created',
					keyId: result.id,
					projectId: input.projectId,
					name: input.name,
				},
			})

			return {
				id: result.id,
				key: result.key, // kf_xxxx — show once, never again
				name: input.name,
				projectId: input.projectId,
			}
		}),

	list: orgProcedure
		.input(
			z
				.object({
					projectId: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const conditions = [eq(projectKeys.organizationId, ctx.organizationId)]

			if (input?.projectId) {
				conditions.push(eq(projectKeys.projectId, input.projectId))
			}

			return ctx.db.query.projectKeys.findMany({
				where: and(...conditions),
			})
		}),

	revoke: orgProcedure.input(z.object({ keyId: z.string() })).mutation(async ({ ctx, input }) => {
		const projectKey = await ctx.db.query.projectKeys.findFirst({
			where: and(
				eq(projectKeys.apiKeyId, input.keyId),
				eq(projectKeys.organizationId, ctx.organizationId),
			),
		})

		if (!projectKey) throwError({ reason: 'NotFound', resource: 'api key' })

		await auth.api.deleteApiKey({
			body: {
				configId: 'org-keys',
				keyId: input.keyId,
			},
			headers: new Headers({
				Authorization: `Bearer ${ctx.session.token}`, // fix this
			}),
		})

		await ctx.db.delete(projectKeys).where(eq(projectKeys.apiKeyId, input.keyId))

		await audit({
			userId: ctx.user.id,
			organizationId: ctx.organizationId,
			event: {
				action: 'api_key.revoked',
				keyId: input.keyId,
				projectId: projectKey.projectId,
			},
		})

		return { success: true }
	}),

	listAll: orgProcedure.query(async ({ ctx }) => {
		const keys = await ctx.db.query.projectKeys.findMany({
			where: eq(projectKeys.organizationId, ctx.organizationId),
		})
		return keys
	}),
})
