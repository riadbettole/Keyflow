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
