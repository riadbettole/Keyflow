import { Hono } from 'hono'
import { auth } from '../../lib/auth'
import { logger } from '../../lib/logger'
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

v1Router.post('/auth/activate', async (c) => {
	const authHeader = c.req.header('Authorization')
	if (!authHeader) return c.json({ error: 'Unauthorized' }, 401)

	const token = authHeader.replace('Bearer ', '')

	// get session
	const session = await auth.api.getSession({
		headers: new Headers({ Authorization: `Bearer ${token}` }),
	})

	if (!session) return c.json({ error: 'Invalid session' }, 401)

	// find first org membership
	const { db } = await import('../../lib/db')
	const { member } = await import('@keyflow/db')
	const { eq } = await import('drizzle-orm')

	const membership = await db.query.member.findFirst({
		where: eq(member.userId, session.user.id),
	})

	if (!membership) return c.json({ activated: false })

	await auth.api.setActiveOrganization({
		body: { organizationId: membership.organizationId },
		headers: new Headers({ Authorization: `Bearer ${token}` }),
	})

	logger.info(
		{
			userId: session.user.id,
			organizationId: membership?.organizationId,
		},
		'Activate called',
	)

	return c.json({ activated: true, organizationId: membership.organizationId })
})
