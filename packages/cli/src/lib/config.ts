import { unlink } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'

const CONFIG_PATH = join(homedir(), '.keyflow', 'config.json')

type Config = {
	baseUrl: string
	token: string
}

export async function getConfig(): Promise<Config | null> {
	try {
		const file = Bun.file(CONFIG_PATH)
		const exists = await file.exists()
		if (!exists) return null
		return await file.json()
	} catch {
		return null
	}
}

export async function saveConfig(config: Config): Promise<void> {
	await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2))
}

export async function clearConfig(): Promise<void> {
	try {
		await unlink(CONFIG_PATH)
	} catch {
		// file didn't exist
	}
}
