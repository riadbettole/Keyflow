import { router } from './init'
import { apiKeysRouter } from './routes/api-keys'
import { auditRouter } from './routes/audit'
import { healthRouter } from './routes/health'
import { projectsRouter } from './routes/projects'
import { statsRouter } from './routes/stats'

export const appRouter = router({
	health: healthRouter,
	projects: projectsRouter,
	apiKeys: apiKeysRouter,
	audit: auditRouter,
	stats: statsRouter,
})

export type AppRouter = typeof appRouter
