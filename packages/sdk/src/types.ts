export type KeyflowConfig = {
	baseUrl: string
	apiKey?: string // for authenticated SDK calls
}

export type VerifyResult =
	| {
			valid: true
			keyId: string
			projectId: string | null
			organizationId: string
			remaining: number
			expiresAt: string | null
	  }
	| {
			valid: false
			reason: string
			retryAfter?: number
	  }

export type CreateKeyResult = {
	id: string
	key: string // shown once
	name: string
	projectId: string
}

export type KeyflowError = {
	code: string
	message: string
	status: number
}
