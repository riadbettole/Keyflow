// tools/cli/src/lib/output.ts
import chalk from 'chalk'

export const log = {
	success: (msg: string) => console.log(chalk.green('✓'), msg),
	error: (msg: string) => console.error(chalk.red('✗'), msg),
	info: (msg: string) => console.log(chalk.blue('→'), msg),
	warn: (msg: string) => console.log(chalk.yellow('!'), msg),
	dim: (msg: string) => console.log(chalk.dim(msg)),
}

export function table(rows: Record<string, string>[]) {
	if (rows.length === 0) return

	const first = rows[0]
	if (!first) return

	const keys = Object.keys(first)

	const widths = keys.map((k) => Math.max(k.length, ...rows.map((r) => (r[k] ?? '').length)))

	console.log(keys.map((k, i) => chalk.dim(k.padEnd(widths[i] ?? 0))).join('  '))
	console.log(chalk.dim('─'.repeat(widths.reduce((a, b) => a + b + 2, 0))))

	rows.forEach((row) => {
		console.log(keys.map((k, i) => (row[k] ?? '').padEnd(widths[i] ?? 0)).join('  '))
	})
}
