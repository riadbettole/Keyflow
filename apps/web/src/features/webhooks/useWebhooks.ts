import { trpc } from '@/shared/lib/trpc'

export function useWebhooks() {
	return trpc.webhooks.list.useQuery()
}

export function useCreateWebhook() {
	const utils = trpc.useUtils()

	return trpc.webhooks.create.useMutation({
		onSuccess: () => utils.webhooks.list.invalidate(),
	})
}

export function useDeleteWebhook() {
	const utils = trpc.useUtils()

	return trpc.webhooks.delete.useMutation({
		onSuccess: () => utils.webhooks.list.invalidate(),
	})
}

export function useToggleWebhook() {
	const utils = trpc.useUtils()

	return trpc.webhooks.toggle.useMutation({
		onSuccess: () => utils.webhooks.list.invalidate(),
	})
}
