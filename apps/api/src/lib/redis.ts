import { env } from '@keyflow/env/server'
import { Redis } from 'ioredis'
import { logger } from './logger'

export const redis = new Redis(env.REDIS_URL)

redis.on('error', (err) => {
	logger.error({ error: err.message }, 'Redis connection error')
})
