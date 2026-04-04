import { z } from 'zod'
import { mongo } from '../../lib/mongo'
import { router } from '../init'
import { orgProcedure } from '../middleware'

export const auditRouter = router({
	list: orgProcedure
		.input(
			z
				.object({
					limit: z.number().min(1).max(100).default(50),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const logs = await mongo
				.collection('audit_logs')
				.find({ organizationId: ctx.organizationId })
				.sort({ timestamp: -1 })
				.limit(input?.limit ?? 50)
				.toArray()

			return logs
		}),
})
