#!/usr/bin/env bun

import { Command } from 'commander'
import { keysListCommand, keysVerifyCommand } from './commands/keys'
import { loginCommand } from './commands/login'

const program = new Command()

program
	.name('keyflow')
	.description('Keyflow CLI — manage your API keys from the terminal')
	.version('0.1.0')

// keyflow login --url https://... --token xxx
program
	.command('login')
	.description('Authenticate with your Keyflow instance')
	.requiredOption('--url <url>', 'Keyflow instance URL')
	.requiredOption('--token <token>', 'Your session token')
	.action((options) => loginCommand(options))

// keyflow keys
const keys = program.command('keys').description('Manage API keys')

// keyflow keys list
keys
	.command('list')
	.description('List all API keys')
	.action(() => keysListCommand())

// keyflow keys verify --key kf_xxx
keys
	.command('verify')
	.description('Verify an API key')
	.requiredOption('--key <key>', 'The API key to verify')
	.action((options) => keysVerifyCommand(options.key))

program.parse()
