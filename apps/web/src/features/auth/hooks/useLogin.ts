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
			fetchOptions: {
				credentials: 'include',
			},
		})

		if (result.error) {
			setError('INVALID_CREDENTIALS')
			setLoading(false)
			return
		}

		// Use the token from the result directly
		const token = result.data?.token

		if (token) {
			const orgs = await authClient.organization.list({
				fetchOptions: {
					headers: { Authorization: `Bearer ${token}` },
					credentials: 'include',
				},
			})

			if (orgs.data && orgs.data.length > 0) {
				await authClient.organization.setActive({
					organizationId: orgs.data[0].id,
					fetchOptions: {
						headers: { Authorization: `Bearer ${token}` },
						credentials: 'include',
					},
				})
			}
		}

		router.navigate({ to: '/dashboard' })
	}

	return { login, error, loading }
}
