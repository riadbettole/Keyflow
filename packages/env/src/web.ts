import { createEnv } from '@t3-oss/env-core'
import * as z from 'zod'

export const env = createEnv({
	clientPrefix: 'VITE_',

	client: {
		VITE_API_URL: z.string().min(1),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
