import { QueryClient } from '@tanstack/react-query'
import { TRPCClientError } from '@trpc/client'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
			retry: (failureCount, error) => {
				if (error instanceof TRPCClientError) {
					if (error.data?.code === 'UNAUTHORIZED' || error.data?.code === 'FORBIDDEN') {
						return false
					}
				}
				return failureCount < 1
			},
		},
		mutations: {
			onError: (error) => {
				console.error('Mutation error:', error)
			},
		},
	},
})
