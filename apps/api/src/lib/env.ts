import { createEnv } from '@t3-oss/env-core'
import * as z from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().startsWith('postgresql://'),
		REDIS_URL: z.string().startsWith('redis://'),
		MONGODB_URL: z.string().startsWith('mongodb://'),
		STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
		STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
		STRIPE_PRO_PRICE_ID: z.string().startsWith('price_'),
		FRONTEND_URL: z.url(),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.url(),
		NODE_ENV: z.string(),
		LOG_LEVEL: z.string(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
