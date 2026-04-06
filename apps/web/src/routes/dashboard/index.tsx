// apps/web/src/routes/dashboard/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { trpc } from '../../shared/lib/trpc'

export const Route = createFileRoute('/dashboard/')({
	component: OverviewPage,
})

function StatCard({
	label,
	value,
	isLoading,
}: {
	label: string
	value: number | undefined
	isLoading: boolean
}) {
	return (
		<div className="bg-gray-900 border border-gray-700 rounded-lg p-5">
			<p className="text-sm text-gray-500 mb-1">{label}</p>
			{isLoading ? (
				<div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
			) : (
				<p className="text-3xl font-semibold text-gray-100">{value?.toLocaleString() ?? '0'}</p>
			)}
		</div>
	)
}

function OverviewPage() {
	const { data: stats, isLoading: statsLoading } = trpc.stats.overview.useQuery()
	const { data: auditLogs, isLoading: auditLoading } = trpc.audit.list.useQuery({ limit: 5 })

	const actionLabel: Record<string, string> = {
		'project.created': 'Created project',
		'project.deleted': 'Deleted project',
		'api_key.created': 'Created API key',
		'api_key.revoked': 'Revoked API key',
	}

	const actionIcon: Record<string, React.ReactNode> = {
		'project.created': (
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			</svg>
		),
		'project.deleted': (
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
			</svg>
		),
		'api_key.created': (
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<circle cx="7.5" cy="15.5" r="5.5" />
				<path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
			</svg>
		),
		'api_key.revoked': (
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
			>
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
		),
	}

	return (
		<div className="max-w-4xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-xl font-semibold text-gray-100">Overview</h1>
				<p className="text-sm text-gray-400 mt-0.5">Your platform at a glance</p>
			</div>

			{/* Stats row */}
			<div className="grid grid-cols-3 gap-4 mb-8">
				<StatCard label="Total projects" value={stats?.totalProjects} isLoading={statsLoading} />
				<StatCard label="Active keys" value={stats?.totalKeys} isLoading={statsLoading} />
				<StatCard label="Requests today" value={stats?.requestsToday} isLoading={statsLoading} />
			</div>

			{/* Recent activity */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-sm font-medium text-gray-400">Recent activity</h2>
					<Link
						to="/dashboard/audit"
						className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
					>
						View all →
					</Link>
				</div>

				<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
					{auditLoading ? (
						<div className="divide-y divide-gray-800">
							{[...Array(4)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <Static element is okay>
								<div key={i} className="flex items-center gap-3 px-4 py-3">
									<div className="w-7 h-7 rounded-md bg-gray-800 animate-pulse shrink-0" />
									<div className="flex-1 space-y-1.5">
										<div className="h-3 w-32 bg-gray-800 rounded animate-pulse" />
										<div className="h-3 w-20 bg-gray-800 rounded animate-pulse" />
									</div>
								</div>
							))}
						</div>
					) : !auditLogs || auditLogs.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 px-4">
							<p className="text-sm text-gray-500">No activity yet</p>
							<p className="text-xs text-gray-600 mt-1">
								Actions like creating projects and keys will appear here
							</p>
						</div>
					) : (
						<div className="divide-y divide-gray-800">
							{auditLogs.map((log) => (
								<div key={String(log._id)} className="flex items-center gap-3 px-4 py-3">
									<div className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center shrink-0 text-gray-400">
										{actionIcon[log.action] ?? (
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
											>
												<circle cx="12" cy="12" r="10" />
											</svg>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-gray-200">
											{actionLabel[log.action] ?? log.action}
											{log.name && <span className="text-gray-400"> — {log.name}</span>}
										</p>
									</div>
									<span className="text-xs text-gray-600 shrink-0">
										{new Date(log.timestamp).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
										})}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
