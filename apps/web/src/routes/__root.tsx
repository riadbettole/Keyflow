import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<Toaster
				position="bottom-right"
				theme="dark"
				toastOptions={{
					style: {
						background: 'hsl(215, 25%, 15%)',
						border: '1px solid hsl(213, 20%, 22%)',
						color: 'hsl(210, 20%, 93%)',
					},
				}}
			/>
			{/* <TanStackRouterDevtools /> */}
		</>
	),
})
