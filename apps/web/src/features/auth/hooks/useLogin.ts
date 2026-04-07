import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient, signIn } from '@/shared/lib/auth'
import type { AuthError, LoginInput } from '../types'

export function useLogin() {
	const router = useRouter()
	const [error, setError] = useState<AuthError | null>(null)
	const [loading, setLoading] = useState(false)

	async function login(input: LoginInput) {
		setLoading(true)
		setError(null)

		const result = await signIn.email({
			email: input.email,
			password: input.password,
		})

		if (result.error) {
			setError('INVALID_CREDENTIALS')
			setLoading(false)
			return
		}

		const orgs = await authClient.organization.list()
		if (orgs.data && orgs.data.length > 0) {
			await authClient.organization.setActive({
				organizationId: orgs.data[0].id,
			})
		}

		router.navigate({ to: '/dashboard' })
	}

	return { login, error, loading }
}
