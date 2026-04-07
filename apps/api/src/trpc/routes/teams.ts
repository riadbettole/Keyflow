import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { auth } from '../../lib/auth'
import { router } from '../init'
import { orgProcedure } from '../middleware'

export const teamRouter = router({
	list: orgProcedure.query(async ({ ctx }) => {
		const org = await auth.api.getFullOrganization({
			headers: new Headers({
				Authorization: `Bearer ${ctx.session.token}`,
			}),
			query: {
				organizationId: ctx.organizationId,
			},
		})

		return org?.members ?? []
	}),

	invite: orgProcedure
		.input(
			z.object({
				email: z.string().email(),
				role: z.enum(['admin', 'member']),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const existingUser = await ctx.db.query.user.findFirst({
				where: (u, { eq }) => eq(u.email, input.email),
			})

			if (!existingUser) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'No Keyflow account found for this email address',
				})
			}

			await auth.api.addMember({
				body: {
					userId: existingUser.id,
					role: input.role,
					organizationId: ctx.organizationId,
				},
			})

			return { email: input.email }
		}),

	remove: orgProcedure
		.input(z.object({ memberId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await auth.api.removeMember({
				body: {
					memberIdOrEmail: input.memberId,
					organizationId: ctx.organizationId,
				},
				headers: new Headers({
					Authorization: `Bearer ${ctx.session.token}`,
				}),
			})
			return { success: true }
		}),

	updateRole: orgProcedure
		.input(
			z.object({
				memberId: z.string(),
				role: z.enum(['admin', 'member']),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await auth.api.updateMemberRole({
				body: {
					memberId: input.memberId,
					role: input.role,
					organizationId: ctx.organizationId,
				},
				headers: new Headers({
					Authorization: `Bearer ${ctx.session.token}`,
				}),
			})
			return { success: true }
		}),
})
