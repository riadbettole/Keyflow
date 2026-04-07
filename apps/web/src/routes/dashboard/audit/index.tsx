// apps/web/src/routes/dashboard/audit.tsx
import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '@/shared/lib/trpc'

export const Route = createFileRoute('/dashboard/audit/')({
	component: AuditPage,
})

const actionLabel: Record<string, string> = {
	'project.created': 'Created project',
	'project.deleted': 'Deleted project',
	'api_key.created': 'Created API key',
	'api_key.revoked': 'Revoked API key',
}

const actionAccent: Record<string, string> = {
	'project.created': 'bg-indigo-500',
	'project.deleted': 'bg-danger',
	'api_key.created': 'bg-success',
	'api_key.revoked': 'bg-warning',
}

function formatDateSeparator(date: Date): string {
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	if (date.toDateString() === today.toDateString()) return 'Today'
	if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

function AuditPage() {
	const { data: logs, isLoading } = trpc.audit.list.useQuery({ limit: 100 })

	// group logs by date
	const grouped = logs?.reduce<Record<string, typeof logs>>((acc, log) => {
		const dateKey = new Date(log.timestamp).toDateString()
		if (!acc[dateKey]) acc[dateKey] = []
		acc[dateKey].push(log)
		return acc
	}, {})

	return (
		<div className="max-w-3xl">
			<div className="mb-8">
				<h1 className="text-xl font-semibold text-gray-100">Audit Log</h1>
				<p className="text-sm text-gray-500 mt-0.5">Every important action in your organization</p>
			</div>

			{isLoading ? (
				<div className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <static comp>
							key={i}
							className="bg-gray-900 border border-gray-800 rounded-lg h-14 animate-pulse"
						/>
					))}
				</div>
			) : !logs || logs.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24">
					<div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="text-gray-500"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
						</svg>
					</div>
					<p className="text-sm text-gray-500">No events yet</p>
					<p className="text-xs text-gray-600 mt-1">
						Actions will appear here as you use the platform
					</p>
				</div>
			) : (
				<div className="space-y-6">
					{Object.entries(grouped ?? {}).map(([dateKey, dateLogs]) => (
						<div key={dateKey}>
							{/* Date separator */}
							<div className="flex items-center gap-3 mb-3">
								<span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
									{formatDateSeparator(new Date(dateKey))}
								</span>
								<div className="flex-1 h-px bg-gray-800" />
							</div>

							{/* Events for this day */}
							<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
								<div className="divide-y divide-gray-800">
									{dateLogs.map((log) => (
										<div
											key={String(log._id)}
											className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-800/40 transition-colors"
										>
											{/* Left accent line */}
											<div
												className={`
                        w-0.5 h-8 rounded-full shrink-0
                        ${actionAccent[log.action] ?? 'bg-gray-700'}
                      `}
											/>

											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-gray-200">
													{actionLabel[log.action] ?? log.action}
												</p>
												{log.name && (
													<p className="text-xs text-gray-500 mt-0.5 truncate">{log.name}</p>
												)}
											</div>

											<span className="text-xs text-gray-600 shrink-0 tabular-nums">
												{new Date(log.timestamp).toLocaleTimeString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
