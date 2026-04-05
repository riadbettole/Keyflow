import { type AppError, AppErrorException } from '@keyflow/errors'
import { TRPCError } from '@trpc/server'
import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { logger } from '../lib/logger'

const statusMap: Record<AppError['reason'], ContentfulStatusCode> = {
	// auth
	Unauthenticated: 401,
	Unauthorized: 403,
	SessionExpired: 401,
	InvalidCredentials: 401,
	EmailAlreadyExists: 409,
	AccountBanned: 403,
	EmailNotVerified: 403,

	// org
	NoActiveOrganization: 400,
	OrganizationNotFound: 404,
	NotOrgMember: 403,
	InsufficientOrgRole: 403,

	// project
	ProjectNotFound: 404,
	ProjectLimitReached: 400,

	// api key
	ApiKeyNotFound: 404,
	ApiKeyExpired: 401,
	ApiKeyDisabled: 401,
	ApiKeyLimitReached: 400,
	MissingApiKey: 401,
	InvalidApiKey: 401,
	RateLimitExceeded: 429,

	// validation
	InvalidData: 400,
	MissingField: 400,

	// database
	NotFound: 404,
	Conflict: 409,

	// fallback
	Unexpected: 500,
}

export function errorHandler(err: Error, c: Context) {
	const requestId = c.get('requestId')

	if (isAppError(err)) {
		// expected errors — warn level, no stack needed
		logger.warn(
			{
				requestId,
				error: err.error.reason,
				// spread extra fields like retryAfter, resource etc
				...err.error,
			},
			'Request failed with known error',
		)

		const status = statusMap[err.error.reason]
		return c.json({ ok: false, error: err.error }, status)
	}

	if (err instanceof TRPCError) {
		logger.warn(
			{
				requestId,
				error: err.code,
				message: err.message,
			},
			'Request failed with tRPC error',
		)

		let reason: unknown
		try {
			reason = JSON.parse(err.message)
		} catch {
			reason = err.message
		}

		return c.json(
			{ ok: false, error: { reason: 'InvalidData', details: reason } },
			trpcCodeToStatus(err.code),
		)
	}

	// unexpected — error level with stack
	logger.error(
		{
			requestId,
			error: err.message,
			stack: err.stack,
		},
		'Unexpected error',
	)

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
