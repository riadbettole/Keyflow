import type { Context as HonoContext } from 'hono'
import type { auth } from '../lib/auth'
import { db } from '../lib/db'
import { logger } from '../lib/logger'
import { mongo } from '../lib/mongo'
import { redis } from '../lib/redis'

type AuthUser = typeof auth.$Infer.Session.user
type AuthSession = typeof auth.$Infer.Session.session

export async function createContext(c: HonoContext) {
	return {
		db,
		redis,
		mongo,
		logger,
		requestId: c.get('requestId'),
		user: c.get('user') as AuthUser | null,
		session: c.get('session') as AuthSession | null,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
