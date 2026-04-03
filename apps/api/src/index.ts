import './lib/env'

import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { auth } from './lib/auth'
import { errorHandler } from './middleware/error'
import { requestLogger } from './middleware/logging'
import { createContext } from './trpc/context'
import { appRouter } from './trpc/router'

type Variables = {
	user: typeof auth.$Infer.Session.user | null
	session: typeof auth.$Infer.Session.session | null
}

const app = new Hono<{ Variables: Variables }>()

app.use(
	'/api/auth/*',
	cors({
		origin: 'http://localhost:3001',
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	}),
)

app.use('*', requestId())
app.use('*', requestLogger)

app.use('*', async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	})

	if (!session) {
		c.set('user', null)
		c.set('session', null)
		await next()
		return
	}

	c.set('user', session.user)
	c.set('session', session.session)
	await next()
})

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	return auth.handler(c.req.raw)
})

app.use('/trpc/*', trpcServer({ router: appRouter, createContext: (_, c) => createContext(c) }))

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.onError(errorHandler)

export default app
