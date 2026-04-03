import '@keyflow/env/server'

import { trpcServer } from '@hono/trpc-server'
import { Hono } from 'hono'
import { requestId } from 'hono/request-id'

import { errorHandler } from './middleware/error'
import { requestLogger } from './middleware/logging'

import { createContext } from './trpc/context'
import { appRouter } from './trpc/router'

const app = new Hono()

app.use('*', requestId())
app.use('*', requestLogger)
app.use('/trpc/*', trpcServer({ router: appRouter, createContext: (_, c) => createContext(c) }))

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.onError(errorHandler)

export default app
