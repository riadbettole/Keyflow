import { createEnv } from '@t3-oss/env-core'
import * as z from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().startsWith('postgresql://'),
		REDIS_URL: z.string().startsWith('redis://'),
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.url(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
