import { createHmac } from 'node:crypto'
import { webhooks } from '@keyflow/db'
import { and, eq } from 'drizzle-orm'
import { db } from './db'
import { logger } from './logger'
import { mongo } from './mongo'

export type WebhookEvent =
	| { type: 'key.rate_limit_exceeded'; keyId: string; projectId: string | null }
	| { type: 'key.expired'; keyId: string; projectId: string | null }
	| { type: 'key.revoked'; keyId: string; projectId: string | null }
	| { type: 'project.created'; projectId: string; name: string }

/**
 * Sign a payload with HMAC-SHA256.
 * The receiver uses the same secret to verify.
 * This proves the request came from Keyflow, not a third party.
 */
function signPayload(payload: string, secret: string): string {
	return createHmac('sha256', secret).update(payload).digest('hex')
}

/**
 * Deliver a webhook with exponential backoff retry.
 * Attempts: 1s → 2s → 4s → 8s → 16s then gives up.
 */
async function deliverWithRetry(
	webhookId: string,
	url: string,
	secret: string,
	eventId: string,
	payload: string,
	attempt = 1,
	maxAttempts = 5,
): Promise<void> {
	const signature = signPayload(payload, secret)

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Keyflow-Event-Id': eventId, // idempotency — receiver deduplicates
				'X-Keyflow-Signature': signature, // authenticity — receiver verifies
				'X-Keyflow-Timestamp': Date.now().toString(),
			},
			body: payload,
			signal: AbortSignal.timeout(10_000), // 10 second timeout
		})

		// log delivery attempt
		await mongo.collection('webhook_deliveries').insertOne({
			webhookId,
			eventId,
			url,
			attempt,
			status: res.ok ? 'success' : 'failed',
			statusCode: res.status,
			timestamp: new Date(),
		})

		if (res.ok) {
			logger.info({ webhookId, eventId, attempt }, 'Webhook delivered')
			return
		}

		throw new Error(`HTTP ${res.status}`)
	} catch (err) {
		logger.warn({ webhookId, eventId, attempt, err }, 'Webhook delivery failed')

		await mongo.collection('webhook_deliveries').insertOne({
			webhookId,
			eventId,
			url,
			attempt,
			status: 'failed',
			error: err instanceof Error ? err.message : 'unknown',
			timestamp: new Date(),
		})

		if (attempt >= maxAttempts) {
			logger.error({ webhookId, eventId }, 'Webhook max attempts reached, giving up')
			return
		}

		// exponential backoff — wait 2^attempt seconds
		const delayMs = 2 ** attempt * 1000
		await new Promise((resolve) => setTimeout(resolve, delayMs))

		return deliverWithRetry(webhookId, url, secret, eventId, payload, attempt + 1, maxAttempts)
	}
}

/**
 * Fire webhooks for an event to all registered URLs for an org.
 * Non-blocking : we don't await this in the request path.
 */
export async function fireWebhooks(organizationId: string, event: WebhookEvent): Promise<void> {
	// find all enabled webhooks for this org that subscribed to this event
	const orgWebhooks = await db.query.webhooks.findMany({
		where: and(eq(webhooks.organizationId, organizationId), eq(webhooks.enabled, true)),
	})

	if (orgWebhooks.length === 0) return

	const eventId = crypto.randomUUID() // same for all deliveries of this event
	const payload = JSON.stringify({
		id: eventId,
		type: event.type,
		timestamp: new Date().toISOString(),
		data: event,
	})

	// filter to webhooks that subscribed to this event type
	const targets = orgWebhooks.filter((wh) => {
		const events = JSON.parse(wh.events) as string[]
		return events.includes(event.type) || events.includes('*')
	})

	// fire all deliveries in parallel — don't block the caller
	for (const wh of targets) {
		deliverWithRetry(wh.id, wh.url, wh.secret, eventId, payload).catch((err) =>
			logger.error({ err, webhookId: wh.id }, 'Unhandled webhook error'),
		)
	}
}
