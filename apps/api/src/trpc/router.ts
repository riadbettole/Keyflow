import { router } from './init'
import { healthRouter } from './routes/health'
import { projectsRouter } from './routes/projects'

export const appRouter = router({
	health: healthRouter,
	projects: projectsRouter,
})

export type AppRouter = typeof appRouter
