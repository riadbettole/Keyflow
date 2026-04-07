import { projectKeys } from '@keyflow/db'
import { eq } from 'drizzle-orm'
import { type Context, Hono } from 'hono'
import { auth } from '../../lib/auth'
import { db } from '../../lib/db'
import { logger } from '../../lib/logger'
import { apiKeyVerifications, rateLimitHits } from '../../lib/metrics'
import { mongo } from '../../lib/mongo'
import { checkRateLimit } from '../../lib/rate-limiter'
import { redis } from '../../lib/redis'
import { fireWebhooks } from '../../lib/webhooks'

export const keysRouter = new Hono()

keysRouter.post('/verify', async (c) => {
	const apiKey = c.req.header('x-api-key')

	if (!apiKey) {
		return c.json({ valid: false, reason: 'MissingApiKey' }, 401)
	}

	// ---------------------------------------------------
	// Step 1: resolve key data (cache-aside pattern)
	// try Redis first, fall back to Postgres if not cached
	// ---------------------------------------------------
	type KeyData = {
		id: string
		projectId: string | null
		referenceId: string
		remaining: number | null
		expiresAt: string | null
	}

	let keyData: KeyData | null = null

	const cached = await redis.get(`apikey:${apiKey}`)

	if (cached) {
		keyData = JSON.parse(cached) as KeyData
		logger.info({ keyId: keyData.id }, 'API key resolved from cache')
	} else {
		// cache miss — validate against Better Auth (reads Postgres)
		const result = await auth.api.verifyApiKey({
			body: { key: apiKey, configId: 'org-keys' },
		})

		if (!result.valid || !result.key) {
			logger.warn({ reason: result.error }, 'API key verification failed')

			apiKeyVerifications.inc({ result: 'invalid' })

			return c.json({ valid: false, reason: result.error ?? 'InvalidApiKey' }, 401)
		}

		// get our project association from join table
		const projectKey = await db.query.projectKeys.findFirst({
			where: eq(projectKeys.apiKeyId, result.key.id),
		})

		keyData = {
			id: result.key.id,
			projectId: projectKey?.projectId ?? null,
			referenceId: result.key.referenceId,
			remaining: result.key.remaining,
			expiresAt: result.key.expiresAt?.toISOString() ?? null,
		}

		// write to cache — TTL 5 minutes
		// tradeoff: a revoked key can still pass for up to 5 minutes
		await redis.set(`apikey:${apiKey}`, JSON.stringify(keyData), 'EX', 300)

		logger.info({ keyId: keyData.id }, 'API key resolved from database and cached')
	}

	// ---------------------------------------------------
	// Step 2: sliding window rate limit check
	// keyed per API key — each key has its own bucket
	// ---------------------------------------------------
	const rateLimitResult = await checkRateLimit(
		`key:${keyData.id}`,
		3, // 1000 requests
		60 * 1000, // per hour
	)

	// return rate limit headers
	// lets the client know how close they are before hitting the wall
	c.header('X-RateLimit-Limit', String(rateLimitResult.limit))
	c.header('X-RateLimit-Remaining', String(rateLimitResult.remaining))

	if (!rateLimitResult.allowed) {
		rateLimitHits.inc()
		apiKeyVerifications.inc({ result: 'rate_limited' })
		c.header('Retry-After', String(rateLimitResult.retryAfter))

		logger.warn(
			{
				keyId: keyData.id,
				retryAfter: rateLimitResult.retryAfter,
			},
			'Rate limit exceeded',
		)

		// fire webhook — non-blocking, never affects response time
		fireWebhooks(keyData.referenceId, {
			type: 'key.rate_limit_exceeded',
			keyId: keyData.id,
			projectId: keyData.projectId,
		}).catch((err) => logger.error({ err, keyId: keyData.id }, 'Webhook fire failed'))

		return c.json(
			{
				valid: false,
				reason: 'RateLimitExceeded',
				retryAfter: rateLimitResult.retryAfter,
			},
			429,
		)
	}

	// ---------------------------------------------------
	// Step 3: log usage to MongoDB
	// every successful verify call is recorded
	// used for dashboard charts and billing
	// ---------------------------------------------------
	await logUsage(keyData, c)

	logger.info({ keyId: keyData.id }, 'API key verified successfully')

	apiKeyVerifications.inc({ result: 'valid' })

	return c.json({
		valid: true,
		keyId: keyData.id,
		projectId: keyData.projectId,
		organizationId: keyData.referenceId,
		remaining: rateLimitResult.remaining, // from rate limiter, not Better Auth
		expiresAt: keyData.expiresAt,
	})
})

async function logUsage(
	key: { id: string; projectId: string | null; referenceId: string },
	c: Context,
) {
	await mongo.collection('usage_logs').insertOne({
		keyId: key.id,
		projectId: key.projectId,
		organizationId: key.referenceId,
		timestamp: new Date(),
		ip: c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown',
		userAgent: c.req.header('user-agent') ?? 'unknown',
	})
}
