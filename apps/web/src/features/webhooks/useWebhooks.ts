import { toast } from 'sonner'
import { trpc } from '@/shared/lib/trpc'

export function useWebhooks() {
	return trpc.webhooks.list.useQuery()
}

export function useCreateWebhook() {
	const utils = trpc.useUtils()

	return trpc.webhooks.create.useMutation({
		onSuccess: () => {
			utils.webhooks.list.invalidate()
		},
		onError: () => {
			toast.error('Failed to create webhook')
		},
	})
}

export function useDeleteWebhook() {
	const utils = trpc.useUtils()

	return trpc.webhooks.delete.useMutation({
		onSuccess: () => {
			utils.webhooks.list.invalidate()
			toast.success('Webhook deleted')
		},
		onError: () => {
			toast.error('Failed to delete webhook')
		},
	})
}

export function useToggleWebhook() {
	const utils = trpc.useUtils()

	return trpc.webhooks.toggle.useMutation({
		onSuccess: (wh) => {
			utils.webhooks.list.invalidate()
			toast.success(wh.enabled ? 'Webhook enabled' : 'Webhook disabled')
		},
		onError: () => {
			toast.error('Failed to update webhook')
		},
	})
}
