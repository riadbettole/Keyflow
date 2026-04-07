import { projectKeys, projects } from '@keyflow/db'
import { auth } from './lib/auth'
import { db } from './lib/db'
import { logger } from './lib/logger'
import { mongo } from './lib/mongo'

async function seedDemo() {
	logger.info('Starting demo seed...')

	// 1. create user
	let userId: string
	try {
		const user = await auth.api.signUpEmail({
			body: {
				email: 'demo@keyflow.dev',
				password: 'password123',
				name: 'Demo User',
			},
		})
		userId = user.user.id
	} catch {
		// user already exists
		const session = await auth.api.signInEmail({
			body: { email: 'demo@keyflow.dev', password: 'password123' },
		})
		userId = session.user.id
	}

	// 2. sign in to get session
	const session = await auth.api.signInEmail({
		body: { email: 'demo@keyflow.dev', password: 'password123' },
	})

	const headers = new Headers({
		Authorization: `Bearer ${session.token}`,
	})

	// 3. create org
	let orgId: string
	try {
		const org = await auth.api.createOrganization({
			body: { name: 'Acme Corp', slug: 'acme-corp' },
			headers,
		})
		orgId = org.id
	} catch {
		const orgs = await auth.api.listOrganizations({ headers })
		orgId = orgs[0].id
	}

	await auth.api.setActiveOrganization({
		body: { organizationId: orgId },
		headers,
	})

	// 4. create 3 projects
	const projectData = [
		{ name: 'AI Image API', description: 'Generate images with our diffusion model' },
		{ name: 'Translation API', description: 'Real-time text translation across 50 languages' },
		{ name: 'OCR Service', description: 'Extract text from images and PDFs' },
	]

	const createdProjects = await Promise.all(
		projectData.map(async (p) => {
			const [project] = await db
				.insert(projects)
				.values({
					id: crypto.randomUUID(),
					organizationId: orgId,
					name: p.name,
					description: p.description,
				})
				.returning()
			return project
		}),
	)

	// 5. create api keys for each project
	const keyNames = ['Production', 'Staging', 'Development']

	for (const project of createdProjects) {
		for (const keyName of keyNames) {
			const result = await auth.api.createApiKey({
				body: {
					configId: 'org-keys',
					name: keyName,
					organizationId: orgId,
					prefix: 'kf_',
				},
				headers,
			})

			await db.insert(projectKeys).values({
				id: crypto.randomUUID(),
				projectId: project.id,
				apiKeyId: result.id,
				organizationId: orgId,
				name: keyName,
				createdBy: userId,
			})
		}
	}

	// 6. seed audit logs in MongoDB
	const auditEvents = [
		{ action: 'project.created', name: 'AI Image API' },
		{ action: 'project.created', name: 'Translation API' },
		{ action: 'project.created', name: 'OCR Service' },
		{ action: 'api_key.created', name: 'Production' },
		{ action: 'api_key.created', name: 'Staging' },
		{ action: 'api_key.created', name: 'Development' },
		{ action: 'api_key.revoked', name: 'Old Key' },
	]

	const now = new Date()
	await mongo.collection('audit_logs').insertMany(
		auditEvents.map((event, i) => ({
			userId,
			organizationId: orgId,
			...event,
			timestamp: new Date(now.getTime() - i * 3_600_000), // spread over last 7 hours
			ip: '127.0.0.1',
		})),
	)

	// 7. seed usage logs — 500 entries over last 24 hours
	const usageLogs = Array.from({ length: 500 }, (_, i) => ({
		keyId: 'demo-key-id',
		projectId: createdProjects[i % 3]?.id,
		organizationId: orgId,
		timestamp: new Date(now.getTime() - i * 172_800), // spread over 24h
		ip: `192.168.1.${(i % 254) + 1}`,
		userAgent: 'keyflow-sdk/0.1.0',
	}))

	await mongo.collection('usage_logs').insertMany(usageLogs)

	logger.info('Demo seed complete ✓')
	logger.info('Email:    demo@keyflow.dev')
	logger.info('Password: password123')
	process.exit(0)
}

seedDemo().catch((err) => {
	logger.error({ err }, 'Demo seed failed')
	process.exit(1)
})
