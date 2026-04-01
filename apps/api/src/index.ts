import { Hono } from 'hono'
import '@keyflow/env/server'

const app = new Hono()

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

export default app
