import { createFileRoute, Link, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { authClient, signOut } from '../shared/lib/auth'
import { ensureActiveOrg, requireAuth } from '../shared/lib/auth-guard'
import { cn } from '../shared/utils/cn'

export const Route = createFileRoute('/dashboard')({
	beforeLoad: () => requireAuth(),
	component: DashboardLayout,
})

const navItems = [
	{
		label: 'Overview',
		to: '/dashboard',
		exact: true,
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<rect x="3" y="3" width="7" height="7" rx="1" />
				<rect x="14" y="3" width="7" height="7" rx="1" />
				<rect x="3" y="14" width="7" height="7" rx="1" />
				<rect x="14" y="14" width="7" height="7" rx="1" />
			</svg>
		),
	},
	{
		label: 'Projects',
		to: '/dashboard/projects',
		exact: false,
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			</svg>
		),
	},
	{
		label: 'API Keys',
		to: '/dashboard/keys',
		exact: false,
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<circle cx="7.5" cy="15.5" r="5.5" />
				<path d="m21 2-9.6 9.6" />
				<path d="m15.5 7.5 3 3L22 7l-3-3" />
			</svg>
		),
	},
	{
		label: 'Audit Log',
		to: '/dashboard/audit',
		exact: false,
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
				<polyline points="14 2 14 8 20 8" />
				<line x1="16" y1="13" x2="8" y2="13" />
				<line x1="16" y1="17" x2="8" y2="17" />
				<polyline points="10 9 9 9 8 9" />
			</svg>
		),
	},
	{
		label: 'Webhooks',
		to: '/dashboard/webhooks',
		exact: false,
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
				<path d="M13.73 21a2 2 0 0 1-3.46 0" />
			</svg>
		),
	},
	{
		label: 'Billing',
		to: '/dashboard/billing',
		exact: false,
		icon: (
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
				<line x1="1" y1="10" x2="23" y2="10" />
			</svg>
		),
	},
]

function DashboardLayout() {
	const router = useRouter()

	const { data: session } = authClient.useSession()
	const userName = session?.user?.name ?? 'User'
	const userInitials = userName
		.split(' ')
		.map((n: string) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
	const orgName = session?.session?.activeOrganizationId ? 'My Workspace' : 'Keyflow'

	useEffect(() => {
		async function checkSession() {
			const session = await authClient.getSession()

			if (!session.data) {
				router.navigate({ to: '/login' })
				return
			}

			if (!session.data.session.activeOrganizationId) {
				await ensureActiveOrg()
				window.location.reload()
			}
		}

		checkSession()
	}, [router.navigate])

	async function handleSignOut() {
		await signOut()
		router.navigate({ to: '/login' })
	}

	return (
		<div className="min-h-screen bg-gray-950 flex">
			<aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col">
				<div className="h-14 flex items-center gap-2 px-4 border-b border-gray-700">
					<div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center shrink-0">
						<span className="text-white font-bold text-xs">K</span>
					</div>
					<span className="text-gray-100 font-semibold text-sm">Keyflow</span>
				</div>

				<nav className="flex-1 px-2 py-4 space-y-0.5">
					{navItems.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							activeOptions={{ exact: item.exact }}
							className={cn(
								'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
								'text-gray-400 hover:text-gray-100 hover:bg-gray-800',
							)}
							activeProps={{
								className: cn(
									'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
									'bg-gray-800 text-gray-100 border-l-2 border-indigo-500 pl-[10px]',
								),
							}}
						>
							<span className="shrink-0">{item.icon}</span>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="p-3 border-t border-gray-700 space-y-1">
					{/* User info */}
					<div className="flex items-center gap-3 px-3 py-2 mb-1">
						<div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
							<span className="text-xs font-semibold text-indigo-400">{userInitials}</span>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-xs font-medium text-gray-300 truncate">{userName}</p>
							<p className="text-xs text-gray-600 truncate">{session?.user?.email}</p>
						</div>
					</div>

					{/* Sign out */}
					<button
						onClick={handleSignOut}
						className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" y1="12" x2="9" y2="12" />
						</svg>
						Sign out
					</button>
				</div>
			</aside>

			<main className="flex-1 flex flex-col min-w-0">
				<header className="h-14 border-b border-gray-700 flex items-center px-6">
					<p className="text-sm font-medium text-gray-300">{orgName}</p>
				</header>
				<div className="flex-1 p-6">
					<Outlet />
				</div>
			</main>
		</div>
	)
}
