import { projectKeys } from '@keyflow/db'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { auth } from '../../lib/auth'
import { db } from '../../lib/db'
import { logger } from '../../lib/logger'

export const keysRouter = new Hono()

keysRouter.post('/verify', async (c) => {
	const apiKey = c.req.header('x-api-key')

	if (!apiKey) {
		return c.json({ valid: false, reason: 'MissingApiKey' }, 401)
	}

	const result = await auth.api.verifyApiKey({
		body: {
			key: apiKey,
			configId: 'org-keys',
		},
	})

	if (!result.valid || !result.key) {
		logger.warn({ reason: result.error }, 'API key verification failed')
		return c.json({ valid: false, reason: result.error ?? 'InvalidApiKey' }, 401)
	}

	const projectKey = await db.query.projectKeys.findFirst({
		where: eq(projectKeys.apiKeyId, result.key.id),
	})

	logger.info(
		{
			keyId: result.key.id,
			projectId: projectKey?.projectId,
		},
		'API key verified successfully',
	)

	return c.json({
		valid: true,
		keyId: result.key.id,
		projectId: projectKey?.projectId ?? null,
		organizationId: result.key.referenceId,
		remaining: result.key.remaining,
		expiresAt: result.key.expiresAt,
	})
})
