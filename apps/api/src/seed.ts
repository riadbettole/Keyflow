// apps/api/src/seed.ts

import { auth } from './lib/auth'
import { logger } from './lib/logger'

async function seed() {
	logger.info('Starting seed...')

	// 1. create user
	await auth.api.signUpEmail({
		body: {
			email: 'dev@keyflow.dev',
			password: 'password123',
			name: 'Dev User',
		},
	})

	// 2. sign in to get session
	const session = await auth.api.signInEmail({
		body: {
			email: 'dev@keyflow.dev',
			password: 'password123',
		},
	})

	const headers = new Headers({
		Authorization: `Bearer ${session.token}`,
	})

	// 3. create org with session
	await auth.api.createOrganization({
		body: { name: 'Dev Org', slug: 'dev-org' },
		headers,
	})

	logger.info('Seed complete ✓')
	logger.info('Email:    dev@keyflow.dev')
	logger.info('Password: password123')
	process.exit(0)
}

seed().catch((err) => {
	logger.error({ error: err.message }, 'Seed failed')
	process.exit(1)
})
