import { router } from './init'
import { healthRouter } from './routes/health'

export const appRouter = router({
	health: healthRouter,
})

export type AppRouter = typeof appRouter
