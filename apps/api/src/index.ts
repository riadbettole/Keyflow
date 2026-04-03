import { Hono } from 'hono'
import '@keyflow/env/server'
import { requestLogger } from './middleware/logging'

const app = new Hono()

app.use('*', requestLogger)

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

export default app
