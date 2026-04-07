import { toast } from 'sonner'
import { trpc } from '@/shared/lib/trpc'

export function useKeys() {
	return trpc.apiKeys.list.useQuery()
}

export function useCreateKey() {
	const utils = trpc.useUtils()

	return trpc.apiKeys.create.useMutation({
		onSuccess: () => {
			utils.apiKeys.list.invalidate()
		},
		onError: () => {
			toast.error('Failed to create API key')
		},
	})
}

export function useRevokeKey() {
	const utils = trpc.useUtils()

	return trpc.apiKeys.revoke.useMutation({
		onSuccess: () => {
			utils.apiKeys.list.invalidate()
			toast.success('API key revoked')
		},
		onError: () => {
			toast.error('Failed to revoke key')
		},
	})
}
