import { createMiddleware } from 'hono/factory'
import { logger } from '../lib/logger'
import { httpRequestDuration, httpRequestsTotal } from '../lib/metrics'

export const requestLogger = createMiddleware(async (c, next) => {
	const start = Date.now()
	const requestId = c.get('requestId')

	await next()

	const duration = Date.now() - start
	const method = c.req.method
	const path = c.req.path
	const status = c.res.status

	logger.info({
		requestId,
		method,
		path,
		status,
		duration,
		userId: c.get('user')?.id,
	})

	// record metrics
	httpRequestsTotal.inc({ method, path, status: String(status) })
	httpRequestDuration.observe({ method, path, status: String(status) }, duration)
})
