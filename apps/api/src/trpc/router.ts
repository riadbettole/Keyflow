import { router } from './init'
import { apiKeysRouter } from './routes/api-keys'
import { auditRouter } from './routes/audit'
import { billingRouter } from './routes/billing'
import { healthRouter } from './routes/health'
import { projectsRouter } from './routes/projects'
import { statsRouter } from './routes/stats'
import { webhooksRouter } from './routes/webhook'

export const appRouter = router({
	health: healthRouter,
	projects: projectsRouter,
	apiKeys: apiKeysRouter,
	audit: auditRouter,
	stats: statsRouter,
	webhooks: webhooksRouter,
	billing: billingRouter,
})

export type AppRouter = typeof appRouter
