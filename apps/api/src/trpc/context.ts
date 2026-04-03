import type { Context as HonoContext } from 'hono'
import { auth } from '../lib/auth'
import { db } from '../lib/db'
import { logger } from '../lib/logger'
import { mongo } from '../lib/mongo'
import { redis } from '../lib/redis'

export async function createContext(c: HonoContext) {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	})

	return {
		db,
		redis,
		mongo,
		logger,
		requestId: c.get('requestId'),
		user: session?.user ?? null,
		session: session?.session ?? null,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
