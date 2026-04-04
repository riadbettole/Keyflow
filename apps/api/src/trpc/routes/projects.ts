import { projects } from '@keyflow/db'
import { throwError } from '@keyflow/errors'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { audit } from '../../lib/audit'
import { router } from '../init'
import { orgProcedure } from '../middleware'

export const projectsRouter = router({
	list: orgProcedure.query(async ({ ctx }) => {
		return ctx.db.query.projects.findMany({
			where: eq(projects.organizationId, ctx.session.activeOrganizationId ?? ''),
			orderBy: (projects, { desc }) => [desc(projects.createdAt)],
		})
	}),

	get: orgProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const project = await ctx.db.query.projects.findFirst({
			where: eq(projects.id, input.id),
		})

		if (!project) throwError({ reason: 'NotFound', resource: 'project' })

		return project
	}),

	create: orgProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
				description: z.string().max(500).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const [project] = await ctx.db
				.insert(projects)
				.values({
					id: crypto.randomUUID(),
					organizationId: ctx.session.activeOrganizationId ?? '',
					name: input.name,
					description: input.description ?? null,
				})
				.returning()

			await audit({
				userId: ctx.user.id,
				organizationId: ctx.organizationId,
				event: {
					action: 'project.created',
					projectId: project.id,
					name: project.name,
				},
			})

			return project
		}),

	update: orgProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).max(100).optional(),
				description: z.string().max(500).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const existing = await ctx.db.query.projects.findFirst({
				where: eq(projects.id, input.id),
			})

			if (!existing) throwError({ reason: 'NotFound', resource: 'project' })

			const [updated] = await ctx.db
				.update(projects)
				.set({
					name: input.name ?? existing.name,
					description: input.description ?? existing.description,
					updatedAt: new Date(),
				})
				.where(eq(projects.id, input.id))
				.returning()

			return updated
		}),

	delete: orgProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		const existing = await ctx.db.query.projects.findFirst({
			where: eq(projects.id, input.id),
		})

		if (!existing) throwError({ reason: 'NotFound', resource: 'project' })

		await ctx.db.delete(projects).where(eq(projects.id, input.id))

		await audit({
			userId: ctx.user.id,
			organizationId: ctx.organizationId,
			event: {
				action: 'project.deleted',
				projectId: input.id,
			},
		})

		return { success: true }
	}),
})
