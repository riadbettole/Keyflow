export type AuthError =
	| { reason: 'Unauthenticated' }
	| { reason: 'Unauthorized'; required: string }
	| { reason: 'SessionExpired' }

export type ApiKeyError =
	| { reason: 'ApiKeyNotFound' }
	| { reason: 'ApiKeyExpired' }
	| { reason: 'ApiKeyDisabled' }

export type RateLimitError = { reason: 'RateLimitExceeded'; retryAfter: number }

export type ValidationError =
	| { reason: 'InvalidData'; details: string }
	| { reason: 'MissingField'; field: string }

export type DatabaseError =
	| { reason: 'NotFound'; resource: string }
	| { reason: 'Conflict'; message: string }

export type AppError =
	| AuthError
	| ApiKeyError
	| RateLimitError
	| ValidationError
	| DatabaseError
	| { reason: 'Unexpected'; message?: string }
