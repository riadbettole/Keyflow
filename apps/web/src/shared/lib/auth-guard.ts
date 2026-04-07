import { redirect } from '@tanstack/react-router'
import { authClient } from './auth'

export async function requireAuth() {
	const session = await authClient.getSession()

	if (!session.data) {
		throw redirect({ to: '/login' })
	}

	// auto-set active org using the session token
	await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/activate`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${session.data.session.token}`,
		},
		credentials: 'include',
	})

	return session.data
}

export async function requireGuest() {
	const session = await authClient.getSession()
	if (session.data) {
		throw redirect({ to: '/dashboard' })
	}
}
