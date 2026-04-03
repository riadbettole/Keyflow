import { type AppError, AppErrorException } from '@keyflow/errors'
import { TRPCError } from '@trpc/server'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { logger } from '../lib/logger'

const statusMap: Record<AppError['reason'], ContentfulStatusCode> = {
	Unauthenticated: 401,
	Unauthorized: 403,
	SessionExpired: 401,
	ApiKeyNotFound: 404,
	ApiKeyExpired: 401,
	ApiKeyDisabled: 401,
	RateLimitExceeded: 429,
	InvalidData: 400,
	MissingField: 400,
	NotFound: 404,
	Conflict: 409,
	Unexpected: 500,
}

export function errorHandler(err: Error, c: Context) {
	logger.error({
		requestId: c.get('requestId'),
		error: err.message,
		stack: err.stack,
	})

	if (err instanceof TRPCError) {
		// try to parse Zod validation errors cleanly
		let reason: unknown
		try {
			reason = JSON.parse(err.message)
		} catch {
			reason = err.message
		}

		return c.json(
			{
				ok: false,
				error: {
					reason: 'ValidationError',
					details: reason,
				},
			},
			trpcCodeToStatus(err.code),
		)
	}

	if (isAppError(err)) {
		const status = statusMap[err.error.reason]
		return c.json({ ok: false, error: err.error }, status)
	}

	return c.json(
		{ ok: false, error: { reason: 'Unexpected', message: 'Something went wrong' } },
		500,
	)
}

function isAppError(err: unknown): err is AppErrorException {
	return err instanceof AppErrorException
}

function trpcCodeToStatus(code: TRPCError['code']): ContentfulStatusCode {
	const map: Partial<Record<TRPCError['code'], ContentfulStatusCode>> = {
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		BAD_REQUEST: 400,
		CONFLICT: 409,
		TOO_MANY_REQUESTS: 429,
		INTERNAL_SERVER_ERROR: 500,
	}
	return map[code] ?? 500
}
