import { redirect } from '@tanstack/react-router'
import { authClient } from './auth'

export async function requireAuth() {
	const session = await authClient.getSession()

	if (!session.data) {
		throw redirect({ to: '/login' })
	}

	if (!session.data.session.activeOrganizationId) {
		await ensureActiveOrg()
		window.location.reload()
	}

	return session.data
}

export async function ensureActiveOrg() {
	const orgs = await authClient.organization.list()
	if (!orgs.data || orgs.data.length === 0) return

	await authClient.organization.setActive({
		organizationId: orgs.data[0].id,
	})
}

export async function requireGuest() {
	const session = await authClient.getSession()
	if (session.data) {
		throw redirect({ to: '/dashboard' })
	}
}
