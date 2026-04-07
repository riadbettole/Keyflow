import { redirect } from '@tanstack/react-router'
import { authClient } from './auth'

export async function requireAuth() {
	const session = await authClient.getSession()

	if (!session.data) {
		throw redirect({ to: '/login' })
	}

	// always ensure active org on every protected route load
	if (!session.data.session.activeOrganizationId) {
		await ensureActiveOrg()
	}

	return session.data
}

export async function requireGuest() {
	const session = await authClient.getSession()
	if (session.data) {
		throw redirect({ to: '/dashboard' })
	}
}

export async function ensureActiveOrg() {
	const orgs = await authClient.organization.list()
	if (!orgs.data || orgs.data.length === 0) return

	await authClient.organization.setActive({
		organizationId: orgs.data[0].id,
	})

	await authClient.getSession({ fetchOptions: { cache: 'no-store' } })
}
