import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient, signIn, signUp } from '@/shared/lib/auth'
import type { AuthError, RegisterInput } from '../types'

export function useRegister() {
	const router = useRouter()
	const [error, setError] = useState<AuthError | null>(null)
	const [loading, setLoading] = useState(false)

	async function register(input: RegisterInput) {
		setLoading(true)
		setError(null)

		const result = await signUp.email({
			name: input.name,
			email: input.email,
			password: input.password,
		})

		if (result.error) {
			setError('UNEXPECTED')
			setLoading(false)
			return
		}

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

		await signIn.email({
			email: input.email,
			password: input.password,
		})

		const org = await authClient.organization.create({
			name: `${input.name}'s Workspace`,
			slug: `${input.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
		})

		await authClient.organization.setActive({
			organizationId: org.data?.id ?? '',
		})

		router.navigate({ to: '/dashboard' })
	}

	return { register, error, loading }
}
