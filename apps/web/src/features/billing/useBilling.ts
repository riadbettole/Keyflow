import { trpc } from '@/shared/lib/trpc'

export function useSubscription() {
	return trpc.billing.subscription.useQuery()
}

export function useCreateCheckout() {
	return trpc.billing.createCheckout.useMutation({
		onSuccess: ({ url }) => {
			if (url) window.location.href = url
		},
	})
}

export function useCreatePortal() {
	return trpc.billing.createPortal.useMutation({
		onSuccess: ({ url }) => {
			window.location.href = url
		},
	})
}
