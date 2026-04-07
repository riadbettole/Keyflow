import { router } from './init'
import { apiKeysRouter } from './routes/api-keys'
import { auditRouter } from './routes/audit'
import { billingRouter } from './routes/billing'
import { healthRouter } from './routes/health'
import { projectsRouter } from './routes/projects'
import { settingsRouter } from './routes/settings'
import { statsRouter } from './routes/stats'
import { teamRouter } from './routes/teams'
import { webhooksRouter } from './routes/webhook'

export const appRouter = router({
	health: healthRouter,
	projects: projectsRouter,
	apiKeys: apiKeysRouter,
	audit: auditRouter,
	stats: statsRouter,
	webhooks: webhooksRouter,
	billing: billingRouter,
	settings: settingsRouter,
	team: teamRouter,
})

export type AppRouter = typeof appRouter
