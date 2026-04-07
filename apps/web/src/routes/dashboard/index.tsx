import { createFileRoute, Link } from '@tanstack/react-router'
import { trpc } from '../../shared/lib/trpc'

export const Route = createFileRoute('/dashboard/')({
	component: OverviewPage,
})

function StatCard({
	label,
	value,
	isLoading,
	accent,
}: {
	label: string
	value: number | undefined
	isLoading: boolean
	accent?: string
}) {
	return (
		<div
			className={`
      bg-gray-900 border border-gray-700 rounded-lg p-6 relative overflow-hidden
      border-t-2 ${accent ?? 'border-t-indigo-500'}
    `}
		>
			<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{label}</p>
			{isLoading ? (
				<div className="h-10 w-20 bg-gray-800 rounded animate-pulse" />
			) : (
				<p className="text-4xl font-bold text-gray-100">{value?.toLocaleString() ?? '0'}</p>
			)}
		</div>
	)
}

const actionLabel: Record<string, string> = {
	'project.created': 'Created project',
	'project.deleted': 'Deleted project',
	'api_key.created': 'Created API key',
	'api_key.revoked': 'Revoked API key',
}

const actionColor: Record<string, string> = {
	'project.created': 'bg-indigo-500',
	'project.deleted': 'bg-danger',
	'api_key.created': 'bg-success',
	'api_key.revoked': 'bg-warning',
}

function OverviewPage() {
	const { data: stats, isLoading: statsLoading } = trpc.stats.overview.useQuery()
	const { data: auditLogs, isLoading: auditLoading } = trpc.audit.list.useQuery({ limit: 5 })

	return (
		<div className="max-w-4xl space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-xl font-semibold text-gray-100">Overview</h1>
				<p className="text-sm text-gray-500 mt-0.5">Your platform at a glance</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4">
				<StatCard
					label="Total projects"
					value={stats?.totalProjects}
					isLoading={statsLoading}
					accent="border-t-indigo-500"
				/>
				<StatCard
					label="Active keys"
					value={stats?.totalKeys}
					isLoading={statsLoading}
					accent="border-t-teal-500"
				/>
				<StatCard
					label="Requests today"
					value={stats?.requestsToday}
					isLoading={statsLoading}
					accent="border-t-indigo-400"
				/>
			</div>

			{/* Recent activity */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-sm font-semibold text-gray-300">Recent activity</h2>
					<Link
						to="/dashboard/audit"
						className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
					>
						View all →
					</Link>
				</div>

				<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
					{auditLoading ? (
						<div className="divide-y divide-gray-800">
							{[...Array(4)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: <static comp>
								<div key={i} className="flex items-center gap-3 px-4 py-3.5">
									<div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse shrink-0" />
									<div className="flex-1 space-y-1.5">
										<div className="h-3 w-40 bg-gray-800 rounded animate-pulse" />
									</div>
									<div className="h-3 w-16 bg-gray-800 rounded animate-pulse" />
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
								<div
									key={String(log._id)}
									className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/40 transition-colors"
								>
									{/* colored dot per event type */}
									<div
										className={`
                    w-1.5 h-1.5 rounded-full shrink-0
                    ${actionColor[log.action] ?? 'bg-gray-500'}
                  `}
									/>

									<p className="flex-1 text-sm text-gray-300">
										{actionLabel[log.action] ?? log.action}
										{log.name && <span className="text-gray-500"> — {log.name}</span>}
									</p>

									<span className="text-xs text-gray-600 shrink-0 tabular-nums">
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
