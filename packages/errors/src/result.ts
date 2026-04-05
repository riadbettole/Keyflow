export type AuthError =
	| { reason: 'Unauthenticated' }
	| { reason: 'Unauthorized'; required?: string }
	| { reason: 'SessionExpired' }
	| { reason: 'InvalidCredentials' }
	| { reason: 'EmailAlreadyExists' }
	| { reason: 'AccountBanned'; banReason?: string }
	| { reason: 'EmailNotVerified' }

export type OrgError =
	| { reason: 'NoActiveOrganization' }
	| { reason: 'OrganizationNotFound' }
	| { reason: 'NotOrgMember' }
	| { reason: 'InsufficientOrgRole'; required: string }

export type ProjectError =
	| { reason: 'ProjectNotFound' }
	| { reason: 'ProjectLimitReached'; max: number }

export type ApiKeyError =
	| { reason: 'ApiKeyNotFound' }
	| { reason: 'ApiKeyExpired' }
	| { reason: 'ApiKeyDisabled' }
	| { reason: 'ApiKeyLimitReached'; max: number }
	| { reason: 'MissingApiKey' }
	| { reason: 'InvalidApiKey' }
	| { reason: 'RateLimitExceeded'; retryAfter: number }

export type ValidationError =
	| { reason: 'InvalidData'; details?: unknown }
	| { reason: 'MissingField'; field: string }

export type DatabaseError =
	| { reason: 'NotFound'; resource: string }
	| { reason: 'Conflict'; resource: string }

export type AppError =
	| AuthError
	| OrgError
	| ProjectError
	| ApiKeyError
	| ValidationError
	| DatabaseError
	| { reason: 'Unexpected'; message?: string }
