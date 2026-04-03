// apps/api/src/seed.ts

import { auth } from './lib/auth'
import { logger } from './lib/logger'

async function seed() {
	logger.info('Starting seed...')

	await auth.api.signUpEmail({
		body: {
			email: 'dev@keyflow.dev',
			password: 'password123',
			name: 'Dev User',
		},
	})

	const session = await auth.api.signInEmail({
		body: {
			email: 'dev@keyflow.dev',
			password: 'password123',
		},
	})

	const headers = new Headers({
		Authorization: `Bearer ${session.token}`,
	})

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
