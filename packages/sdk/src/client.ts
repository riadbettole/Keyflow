import type { CreateKeyResult, KeyflowConfig, KeyflowError, VerifyResult } from './types'

export class KeyflowClient {
	private baseUrl: string
	private apiKey: string | undefined

	constructor(config: KeyflowConfig) {
		// strip trailing slash so URLs compose cleanly
		this.baseUrl = config.baseUrl.replace(/\/$/, '')
		this.apiKey = config.apiKey
	}

	// ---------------------------------------------------
	// internal fetch wrapper
	// handles errors consistently so callers never get
	// raw fetch errors — they always get a KeyflowError
	// ---------------------------------------------------
	private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${path}`

		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...(options.headers as Record<string, string>),
		}

		if (this.apiKey) {
			headers.Authorization = `Bearer ${this.apiKey}`
		}

		const res = await fetch(url, {
			...options,
			headers,
		})

		if (!res.ok) {
			const body = await res.json().catch(() => ({}))
			const error: KeyflowError = {
				code: body.error?.reason ?? 'UNKNOWN_ERROR',
				message: body.error?.message ?? 'An unexpected error occurred',
				status: res.status,
			}
			throw error
		}

		return res.json() as Promise<T>
	}

	// ---------------------------------------------------
	// keys namespace
	// ---------------------------------------------------
	keys = {
		/**
		 * Verify an API key.
		 * Call this in your API middleware on every inbound request.
		 *
		 * @example
		 * const result = await keyflow.keys.verify(req.headers['x-api-key'])
		 * if (!result.valid) return res.status(401).json({ error: 'Unauthorized' })
		 */
		verify: async (key: string): Promise<VerifyResult> => {
			return this.request<VerifyResult>('/v1/keys/verify', {
				method: 'POST',
				headers: {
					'x-api-key': key,
				},
			})
		},

		/**
		 * Create a new API key for a project.
		 * Server-side only — requires your Keyflow session token.
		 *
		 * @example
		 * const { key } = await keyflow.keys.create({
		 *   projectId: 'proj_123',
		 *   name: 'Production'
		 * })
		 * // store key securely — shown once
		 */
		create: async (input: {
			projectId: string
			name: string
			expiresIn?: number
		}): Promise<CreateKeyResult> => {
			return this.request<CreateKeyResult>('/trpc/apiKeys.create', {
				method: 'POST',
				body: JSON.stringify(input),
			})
		},
	}
}
