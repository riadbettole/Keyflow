import 'dotenv/config'
import { env } from '@keyflow/env/db'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/schema/index.ts',
	out: './migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
})
