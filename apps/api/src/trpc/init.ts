import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from './context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.user || !ctx.session) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user,
			session: ctx.session,
		},
	})
})
