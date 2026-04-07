import ora from 'ora'
import { getConfig } from '../lib/config'
import { log, table } from '../lib/output'

type KeyRow = {
	id: string
	name: string
	projectId: string
	organizationId: string
	createdAt: string
}

async function getClientAndConfig() {
	const config = await getConfig()
	if (!config) {
		log.error('Not logged in.')
		process.exit(1)
	}

	await fetch(`${config.baseUrl}/v1/auth/activate`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${config.token}` },
	}).catch(() => {})

	return config
}

export async function keysListCommand() {
	const spinner = ora('Fetching keys...').start()

	try {
		const config = await getConfig()
		if (!config) {
			log.error(
				'Not logged in. Run: keyflow login --url <url> --email <email> --password <password>',
			)
			process.exit(1)
		}

		const res = await fetch(`${config.baseUrl}/trpc/apiKeys.listAll`, {
			headers: {
				Authorization: `Bearer ${config.token}`,
			},
		})

		const json = (await res.json()) as { result?: { data?: KeyRow[] } }
		const keys = json.result?.data ?? []

		spinner.stop()

		if (keys.length === 0) {
			log.info('No API keys found')
			return
		}

		table(
			keys.map((k) => ({
				ID: k.id,
				Name: k.name,
				Project: k.projectId,
				Created: new Date(k.createdAt).toLocaleDateString(),
			})),
		)
	} catch {
		spinner.stop()
		log.error('Failed to fetch keys')
		process.exit(1)
	}
}

export async function keysVerifyCommand(key: string) {
	const spinner = ora('Verifying key...').start()

	try {
		const config = await getClientAndConfig()

		const res = await fetch(`${config.baseUrl}/v1/keys/verify`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${config.token}`,
				'x-api-key': key,
			},
		})

		const result = (await res.json()) as {
			valid: boolean
			keyId?: string
			organizationId?: string
			remaining?: number
			reason?: string
			retryAfter?: number
		}

		spinner.stop()

		if (result.valid) {
			log.success('Key is valid')
			log.dim(`Key ID:    ${result.keyId}`)
			log.dim(`Org ID:    ${result.organizationId}`)
			log.dim(`Remaining: ${result.remaining}`)
		} else {
			log.error(`Key is invalid — ${result.reason}`)
			if (result.reason === 'RateLimitExceeded') {
				log.warn(`Retry after ${result.retryAfter}s`)
			}
		}
	} catch {
		spinner.stop()
		log.error('Verification failed')
		process.exit(1)
	}
}
