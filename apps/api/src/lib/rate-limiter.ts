import { redis } from './redis'

type RateLimitResult =
	| { allowed: true; remaining: number; limit: number }
	| { allowed: false; remaining: 0; limit: number; retryAfter: number }

/**
 * Implements a sliding window rate limiter using Redis Sorted Sets to track request timestamps.
 * It automatically cleans old entries and calculates the exact wait time (retryAfter) if the limit is reached.
 */
export async function checkRateLimit(
	key: string,
	limit: number,
	windowMs: number,
): Promise<RateLimitResult> {
	const now = Date.now()
	const windowStart = now - windowMs
	const redisKey = `ratelimit:${key}`

	const pipeline = redis.pipeline()

	// remove entries outside the window
	// count remaining entries in window
	// add current request with timestamp as score
	// expire the key after the window so Redis cleans up
	pipeline.zremrangebyscore(redisKey, '-inf', windowStart)
	pipeline.zcard(redisKey)
	pipeline.zadd(redisKey, now, `${now}-${Math.random()}`)
	pipeline.pexpire(redisKey, windowMs)

	const results = await pipeline.exec()

	// zcard result is at index 1
	const count = (results?.[1]?.[1] as number) ?? 0

	if (count >= limit) {
		// find the oldest entry to calculate retry time
		const oldest = await redis.zrange(redisKey, 0, 0, 'WITHSCORES')
		const oldestTimestamp = oldest[1] ? parseInt(oldest[1], 10) : now
		const retryAfter = Math.ceil((oldestTimestamp + windowMs - now) / 1000)

		return {
			allowed: false,
			remaining: 0,
			limit,
			retryAfter,
		}
	}

	return {
		allowed: true,
		remaining: limit - count - 1,
		limit,
	}
}
