import { projectKeys, projects } from '@keyflow/db'
import { eq } from 'drizzle-orm'
import { mongo } from '../../lib/mongo'
import { router } from '../init'
import { orgProcedure } from '../middleware'

export const statsRouter = router({
	overview: orgProcedure.query(async ({ ctx }) => {
		const startOfDay = new Date()
		startOfDay.setHours(0, 0, 0, 0)

		const [totalProjects, totalKeys, requestsToday] = await Promise.all([
			ctx.db
				.select()
				.from(projects)
				.where(eq(projects.organizationId, ctx.organizationId))
				.then((r) => r.length),

			ctx.db
				.select()
				.from(projectKeys)
				.where(eq(projectKeys.organizationId, ctx.organizationId))
				.then((r) => r.length),

			mongo.collection('usage_logs').countDocuments({
				organizationId: ctx.organizationId,
				timestamp: { $gte: startOfDay },
			}),
		])

		return { totalProjects, totalKeys, requestsToday }
	}),
})
