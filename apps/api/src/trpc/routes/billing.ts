import { subscriptions } from '@keyflow/db'
import { eq } from 'drizzle-orm'
import { env } from '../../lib/env'
import { stripe } from '../../lib/stripe'
import { router } from '../init'
import { orgProcedure } from '../middleware'

export const billingRouter = router({
	// get current plan
	subscription: orgProcedure.query(async ({ ctx }) => {
		const sub = await ctx.db.query.subscriptions.findFirst({
			where: eq(subscriptions.organizationId, ctx.organizationId),
		})

		// if no subscription record exists, they're on free plan
		return (
			sub ?? {
				plan: 'free',
				status: 'active',
				currentPeriodEnd: null,
				stripeCustomerId: null,
				stripeSubscriptionId: null,
			}
		)
	}),

	// create Stripe checkout session → redirect user to Stripe
	createCheckout: orgProcedure.mutation(async ({ ctx }) => {
		// get or create Stripe customer
		const sub = await ctx.db.query.subscriptions.findFirst({
			where: eq(subscriptions.organizationId, ctx.organizationId),
		})

		let customerId = sub?.stripeCustomerId

		if (!customerId) {
			const customer = await stripe.customers.create({
				email: ctx.user.email,
				name: ctx.user.name ?? undefined,
				metadata: {
					organizationId: ctx.organizationId,
				},
			})
			customerId = customer.id
		}

		// create checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			mode: 'subscription',
			line_items: [
				{
					price: env.STRIPE_PRO_PRICE_ID,
					quantity: 1,
				},
			],
			success_url: `${env.FRONTEND_URL}/dashboard/billing?success=true`,
			cancel_url: `${env.FRONTEND_URL}/dashboard/billing?cancelled=true`,
			metadata: {
				organizationId: ctx.organizationId,
			},
		})

		return { url: session.url }
	}),

	// create billing portal session → manage subscription
	createPortal: orgProcedure.mutation(async ({ ctx }) => {
		const sub = await ctx.db.query.subscriptions.findFirst({
			where: eq(subscriptions.organizationId, ctx.organizationId),
		})

		if (!sub?.stripeCustomerId) {
			throw new Error('No billing account found')
		}

		const session = await stripe.billingPortal.sessions.create({
			customer: sub.stripeCustomerId,
			return_url: `${env.FRONTEND_URL}/dashboard/billing`,
		})

		return { url: session.url }
	}),
})
