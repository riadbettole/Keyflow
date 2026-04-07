import { processedEvents, subscriptions } from '@keyflow/db'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type Stripe from 'stripe'
import { db } from '../../lib/db'
import { env } from '../../lib/env'
import { logger } from '../../lib/logger'
import { stripe } from '../../lib/stripe'

export const stripeRouter = new Hono()

stripeRouter.post('/webhook', async (c) => {
	console.log('WEBHOOK HIT')
	console.log('SECRET STARTS WITH:', env.STRIPE_WEBHOOK_SECRET.slice(0, 15))
	console.log('HAS SIG:', !!c.req.header('stripe-signature'))

	const signature = c.req.header('stripe-signature')

	if (!signature) {
		return c.json({ error: 'Missing signature' }, 400)
	}

	// get raw body — Stripe needs the exact bytes to verify signature
	const rawBody = await c.req.text()
	console.log('BODY LENGTH:', rawBody.length)
	logger.info(
		{
			hasSignature: !!signature,
			bodyLength: rawBody.length,
			secret: `${env.STRIPE_WEBHOOK_SECRET.slice(0, 10)}...`,
		},
		'Stripe webhook hit',
	)

	let event: Stripe.Event

	try {
		event = await stripe.webhooks.constructEventAsync(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
	} catch (err) {
		logger.warn({ err }, 'Invalid Stripe webhook signature')
		return c.json({ error: 'Invalid signature' }, 400)
	}

	// -----------------------------------------------
	// IDEMPOTENCY CHECK
	// If we've already processed this event, skip it.
	// Stripe can deliver the same event multiple times.
	// -----------------------------------------------
	const alreadyProcessed = await db.query.processedEvents.findFirst({
		where: eq(processedEvents.id, event.id),
	})

	if (alreadyProcessed) {
		logger.info({ eventId: event.id }, 'Stripe event already processed, skipping')
		return c.json({ received: true })
	}

	logger.info({ eventId: event.id, type: event.type }, 'Processing Stripe event')

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object as Stripe.Checkout.Session
				const organizationId = session.metadata?.organizationId

				if (!organizationId || !session.customer || !session.subscription) break

				// upsert subscription record
				const existing = await db.query.subscriptions.findFirst({
					where: eq(subscriptions.organizationId, organizationId),
				})

				if (existing) {
					await db
						.update(subscriptions)
						.set({
							stripeCustomerId: session.customer as string,
							stripeSubscriptionId: session.subscription as string,
							plan: 'pro',
							status: 'active',
							updatedAt: new Date(),
						})
						.where(eq(subscriptions.organizationId, organizationId))
				} else {
					await db.insert(subscriptions).values({
						id: crypto.randomUUID(),
						organizationId,
						stripeCustomerId: session.customer as string,
						stripeSubscriptionId: session.subscription as string,
						plan: 'pro',
						status: 'active',
					})
				}

				logger.info({ organizationId }, 'Upgraded to pro plan')
				break
			}

			case 'customer.subscription.deleted': {
				const sub = event.data.object as Stripe.Subscription
				const organizationId = sub.metadata?.organizationId

				if (!organizationId) break

				await db
					.update(subscriptions)
					.set({
						plan: 'free',
						status: 'cancelled',
						updatedAt: new Date(),
					})
					.where(eq(subscriptions.organizationId, organizationId))

				logger.info({ organizationId }, 'Subscription cancelled, downgraded to free')
				break
			}

			case 'customer.subscription.updated': {
				const sub = event.data.object as Stripe.Subscription
				const organizationId = sub.metadata?.organizationId

				if (!organizationId) break

				const firstItem = sub.items.data[0]
				const periodEnd = firstItem?.current_period_end
					? new Date(firstItem.current_period_end * 1000)
					: null

				await db
					.update(subscriptions)
					.set({
						status: sub.status === 'active' ? 'active' : 'past_due',
						currentPeriodEnd: periodEnd,
						updatedAt: new Date(),
					})
					.where(eq(subscriptions.organizationId, organizationId))

				break
			}
		}

		// mark event as processed — prevents duplicate handling
		await db.insert(processedEvents).values({
			id: event.id,
		})

		return c.json({ received: true })
	} catch (err) {
		logger.error({ err, eventId: event.id }, 'Error processing Stripe webhook')
		// return 500 so Stripe retries — but we have idempotency so it's safe
		return c.json({ error: 'Processing failed' }, 500)
	}
})
