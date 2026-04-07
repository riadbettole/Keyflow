import ora from 'ora'
import { saveConfig } from '../lib/config'
import { log } from '../lib/output'

export async function loginCommand(options: { url: string; token: string }) {
	const spinner = ora('Connecting to Keyflow...').start()

	try {
		const res = await fetch(`${options.url}/trpc/health.ping`)
		if (!res.ok) throw new Error('Could not reach instance')

		await saveConfig({
			baseUrl: options.url,
			token: options.token,
		})

		spinner.stop()
		log.success('Logged in successfully')
		log.dim(`Connected to ${options.url}`)
	} catch {
		spinner.stop()
		log.error('Could not connect — check your URL and token')
		process.exit(1)
	}
}
