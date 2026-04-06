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

const actionColor: Record<string, string> = {
	'project.created': 'text-indigo-400 bg-indigo-500/10',
	'project.deleted': 'text-danger-text bg-danger-muted',
	'api_key.created': 'text-success-text bg-success-muted',
	'api_key.revoked': 'text-warning-text bg-warning-muted',
}

function AuditPage() {
	const { data: logs, isLoading } = trpc.audit.list.useQuery({ limit: 100 })

	return (
		<div className="max-w-3xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-xl font-semibold text-gray-100">Audit Log</h1>
				<p className="text-sm text-gray-400 mt-0.5">Every important action in your organization</p>
			</div>

			{/* Timeline */}
			{isLoading ? (
				<div className="space-y-3">
					{[...Array(5)].map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <Static element is okay>
							key={i}
							className="bg-gray-900 border border-gray-800 rounded-lg h-16 animate-pulse"
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
				<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
					<div className="divide-y divide-gray-800">
						{logs.map((log) => (
							<div
								key={String(log._id)}
								className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-800/40 transition-colors"
							>
								{/* Action badge */}
								<span
									className={`
                    shrink-0 text-xs font-medium px-2 py-1 rounded-md
                    ${actionColor[log.action] ?? 'text-gray-400 bg-gray-800'}
                  `}
								>
									{actionLabel[log.action] ?? log.action}
								</span>

								{/* Details */}
								<div className="flex-1 min-w-0">
									{log.name && <p className="text-sm text-gray-300 truncate">{log.name}</p>}
								</div>

								{/* Timestamp */}
								<span className="text-xs text-gray-600 shrink-0">
									{new Date(log.timestamp).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
