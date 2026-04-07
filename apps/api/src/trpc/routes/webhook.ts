import { randomBytes } from 'node:crypto'
import { webhooks } from '@keyflow/db'
import { throwError } from '@keyflow/errors'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { router } from '../init'
import { orgProcedure } from '../middleware'

const VALID_EVENTS = [
	'key.rate_limit_exceeded',
	'key.expired',
	'key.revoked',
	'project.created',
	'*',
] as const

export const webhooksRouter = router({
	list: orgProcedure.query(async ({ ctx }) => {
		return ctx.db.query.webhooks.findMany({
			where: eq(webhooks.organizationId, ctx.organizationId),
			orderBy: (webhooks, { desc }) => [desc(webhooks.createdAt)],
		})
	}),

	create: orgProcedure
		.input(
			z.object({
				url: z.string().url(),
				events: z.array(z.enum(VALID_EVENTS)).min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// generate a random signing secret
			const secret = randomBytes(32).toString('hex')

			const [webhook] = await ctx.db
				.insert(webhooks)
				.values({
					id: crypto.randomUUID(),
					organizationId: ctx.organizationId,
					url: input.url,
					secret,
					events: JSON.stringify(input.events),
					enabled: true,
				})
				.returning()

			return {
				...webhook,
				secret, // return secret once — same pattern as API keys
			}
		}),

	delete: orgProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		const existing = await ctx.db.query.webhooks.findFirst({
			where: and(eq(webhooks.id, input.id), eq(webhooks.organizationId, ctx.organizationId)),
		})

		if (!existing) throwError({ reason: 'NotFound', resource: 'webhook' })

		await ctx.db.delete(webhooks).where(eq(webhooks.id, input.id))

		return { success: true }
	}),

	toggle: orgProcedure
		.input(z.object({ id: z.string(), enabled: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const existing = await ctx.db.query.webhooks.findFirst({
				where: and(eq(webhooks.id, input.id), eq(webhooks.organizationId, ctx.organizationId)),
			})

			if (!existing) throwError({ reason: 'NotFound', resource: 'webhook' })

			const [updated] = await ctx.db
				.update(webhooks)
				.set({ enabled: input.enabled, updatedAt: new Date() })
				.where(eq(webhooks.id, input.id))
				.returning()

			return updated
		}),

	// delivery history for a webhook
	deliveries: orgProcedure
		.input(z.object({ webhookId: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.mongo
				.collection('webhook_deliveries')
				.find({ webhookId: input.webhookId })
				.sort({ timestamp: -1 })
				.limit(50)
				.toArray()
		}),
})
