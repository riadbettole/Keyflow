import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { httpBatchLink } from '@trpc/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routeTree } from './routeTree.gen'
import { queryClient } from './shared/lib/query'
import { trpc } from './shared/lib/trpc'

const trpcClient = trpc.createClient({
	links: [
		httpBatchLink({
			url: `${import.meta.env.VITE_API_URL}/trpc`,
			fetch: (url, options) =>
				fetch(url, {
					...options,
					credentials: 'include',
				}),
		}),
	],
})

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

// biome-ignore lint/style/noNonNullAssertion: <Required by Vite>
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</trpc.Provider>
	</StrictMode>,
)
