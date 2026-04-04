import { apiKey } from '@better-auth/api-key'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, bearer, organization } from 'better-auth/plugins'
import { createAccessControl } from 'better-auth/plugins/access'
import { db } from './db'
import { env } from './env'
import { redis } from './redis'

const statements = {
	apiKey: ['create', 'read', 'update', 'delete'],
	webhook: ['create', 'read', 'update', 'delete'],
} as const

const ac = createAccessControl(statements)

const adminRole = ac.newRole({
	apiKey: ['create', 'read', 'update', 'delete'],
	webhook: ['create', 'read', 'update', 'delete'],
})

const memberRole = ac.newRole({
	apiKey: ['read'],
	webhook: ['read'],
})

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
	}),

	secondaryStorage: {
		get: async (key) => {
			const value = await redis.get(key)
			return value ? value : null
		},
		set: async (key, value, ttl) => {
			if (ttl) {
				await redis.set(key, value, 'EX', ttl)
			} else {
				await redis.set(key, value)
			}
		},
		delete: async (key) => {
			await redis.del(key)
		},
	},

	emailAndPassword: {
		enabled: true,
	},

	trustedOrigins: [env.FRONTEND_URL],

	plugins: [
		admin(),
		organization({
			ac,
			roles: {
				admin: adminRole,
				member: memberRole,
			},
		}),
		apiKey([
			{
				configId: 'org-keys',
				defaultPrefix: 'kf_',
				references: 'organization',
			},
		]),
		bearer(),
	],
})
