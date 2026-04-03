import { createDb } from '@keyflow/db'
import { env } from '@keyflow/env/server'

export const db = createDb(env.DATABASE_URL)
