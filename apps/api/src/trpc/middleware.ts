import { TRPCError } from '@trpc/server'
import { protectedProcedure } from './init'

export const orgProcedure = protectedProcedure.use(({ ctx, next }) => {
	if (!ctx.session.activeOrganizationId) {
		throw new TRPCError({
			code: 'BAD_REQUEST',
			message: 'No active organization selected',
		})
	}

	return next({
		ctx: {
			...ctx,
			organizationId: ctx.session.activeOrganizationId,
		},
	})
})
