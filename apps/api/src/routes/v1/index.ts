import { Hono } from 'hono'
import { registry } from '../../lib/metrics'
import { keysRouter } from './keys'
import { stripeRouter } from './stripe'

export const v1Router = new Hono()

v1Router.route('/keys', keysRouter)
v1Router.route('/stripe', stripeRouter)

v1Router.get('/metrics', async (c) => {
	const metrics = await registry.metrics()
	return c.text(metrics, 200, {
		'Content-Type': registry.contentType,
	})
})
