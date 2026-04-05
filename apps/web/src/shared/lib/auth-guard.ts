import { redirect } from '@tanstack/react-router'
import { authClient } from './auth'

export async function requireAuth() {
	const session = await authClient.getSession()

	if (!session.data) {
		throw redirect({ to: '/login' })
	}

	return session.data
}

export async function requireGuest() {
	const session = await authClient.getSession()

	if (session.data) {
		throw redirect({ to: '/dashboard' })
	}
}
