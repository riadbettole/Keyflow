import { router } from './init'
import { apiKeysRouter } from './routes/api-keys'
import { healthRouter } from './routes/health'
import { projectsRouter } from './routes/projects'

export const appRouter = router({
	health: healthRouter,
	projects: projectsRouter,
	apiKeys: apiKeysRouter,
})

export type AppRouter = typeof appRouter
