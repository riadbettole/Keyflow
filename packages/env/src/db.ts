import { createEnv } from '@t3-oss/env-core'
import * as z from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().startsWith('postgresql://'),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
