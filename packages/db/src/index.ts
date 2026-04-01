import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/index.ts'

export function createDb(connectionString: string) {
	const client = postgres(connectionString)
	return drizzle(client, { schema })
}

export * from './schema/index.ts'
