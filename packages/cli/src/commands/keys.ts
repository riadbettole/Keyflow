import { KeyflowClient } from '@keyflow/sdk'
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
		log.error('Not logged in. Run: keyflow login --url <url> --token <token>')
		process.exit(1)
	}
	const client = new KeyflowClient({ baseUrl: config.baseUrl })
	return { client, config }
}

export async function keysListCommand() {
	const spinner = ora('Fetching keys...').start()

	try {
		const { config } = await getClientAndConfig()

		const res = await fetch(`${config.baseUrl}/trpc/apiKeys.list`, {
			headers: {
				cookie: `better-auth.session_token=${config.token}`,
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
		const { client } = await getClientAndConfig()
		const result = await client.keys.verify(key)

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
