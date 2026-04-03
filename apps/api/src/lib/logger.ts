import { env } from '@keyflow/env/server'
import pino from 'pino'

export const logger = pino({
	level: env.LOG_LEVEL ?? 'info',
	transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
})
