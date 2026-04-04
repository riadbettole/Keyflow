import { projectKeys } from '@keyflow/db'
import { eq } from 'drizzle-orm'
import { type Context, Hono } from 'hono'
import { auth } from '../../lib/auth'
import { db } from '../../lib/db'
import { logger } from '../../lib/logger'
import { mongo } from '../../lib/mongo'
import { redis } from '../../lib/redis'

export const keysRouter = new Hono()

keysRouter.post('/verify', async (c) => {
	const apiKey = c.req.header('x-api-key')

	if (!apiKey) {
		return c.json({ valid: false, reason: 'MissingApiKey' }, 401)
	}

	// check Redis cache first
	const cached = await redis.get(`apikey:${apiKey}`)
	if (cached) {
		const key = JSON.parse(cached)
		logger.info({ keyId: key.id }, 'API key verified from cache')

		await logUsage(key, c)

		return c.json({
			valid: true,
			keyId: key.id,
			projectId: key.projectId,
			organizationId: key.referenceId,
			remaining: key.remaining,
			expiresAt: key.expiresAt,
		})
	}

	const result = await auth.api.verifyApiKey({
		body: { key: apiKey, configId: 'org-keys' },
	})

	if (!result.valid || !result.key) {
		logger.warn({ reason: result.error }, 'API key verification failed')
		return c.json({ valid: false, reason: result.error ?? 'InvalidApiKey' }, 401)
	}

	const projectKey = await db.query.projectKeys.findFirst({
		where: eq(projectKeys.apiKeyId, result.key.id),
	})

	const cacheValue = {
		id: result.key.id,
		projectId: projectKey?.projectId ?? null,
		referenceId: result.key.referenceId,
		remaining: result.key.remaining,
		expiresAt: result.key.expiresAt,
	}
	await redis.set(`apikey:${apiKey}`, JSON.stringify(cacheValue), 'EX', 300)

	await logUsage(cacheValue, c)

	logger.info({ keyId: result.key.id }, 'API key verified from database')

	return c.json({
		valid: true,
		keyId: result.key.id,
		projectId: cacheValue.projectId,
		organizationId: result.key.referenceId,
		remaining: result.key.remaining,
		expiresAt: result.key.expiresAt,
	})
})

// extracted so both paths use the same logging
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
