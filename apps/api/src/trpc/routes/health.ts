import { protectedProcedure, publicProcedure, router } from '../init'

export const healthRouter = router({
	ping: publicProcedure.query(() => {
		return { status: 'ok', timestamp: new Date().toISOString() }
	}),

	me: protectedProcedure.query(({ ctx }) => {
		return { user: ctx.user }
	}),
})
