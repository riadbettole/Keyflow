import ora from 'ora'
import { saveConfig } from '../lib/config'
import { log } from '../lib/output'

export async function loginCommand(options: { url: string; email: string; password: string }) {
	const spinner = ora('Signing in...').start()

	try {
		const res = await fetch(`${options.url}/api/auth/sign-in/email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: options.email,
				password: options.password,
			}),
		})

		if (!res.ok) {
			spinner.stop()
			log.error('Invalid email or password')
			process.exit(1)
		}

		const data = (await res.json()) as { token: string }

		await fetch(`${options.url}/v1/auth/activate`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${data.token}` },
		})

		await saveConfig({
			baseUrl: options.url,
			token: data.token,
		})

		spinner.stop()
		log.success('Logged in successfully')
		log.dim(`Connected to ${options.url}`)
	} catch {
		spinner.stop()
		log.error('Could not connect — check your URL and credentials')
		process.exit(1)
	}
}
