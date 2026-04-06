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
	})
}

export function useRevokeKey() {
	const utils = trpc.useUtils()

	return trpc.apiKeys.revoke.useMutation({
		onSuccess: () => {
			utils.apiKeys.list.invalidate()
		},
	})
}
