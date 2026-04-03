import { createMiddleware } from 'hono/factory'
import { logger } from '../lib/logger'

export const requestLogger = createMiddleware(async (c, next) => {
	const start = Date.now()
	const requestId = c.get('requestId')

	await next()

	logger.info({
		requestId,
		method: c.req.method,
		path: c.req.path,
		status: c.res.status,
		duration: Date.now() - start,
		userId: c.get('user')?.id,
	})
})
