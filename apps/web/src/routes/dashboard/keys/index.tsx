import { createFileRoute, Link } from '@tanstack/react-router'
import { useRevokeKey } from '@/features/keys/useKeys'
import { trpc } from '@/shared/lib/trpc'

export const Route = createFileRoute('/dashboard/keys/')({
	component: KeysPage,
})

function KeysPage() {
	const { data: keys, isLoading } = trpc.apiKeys.listAll.useQuery()
	const { data: projects } = trpc.projects.list.useQuery()
	const revokeKey = useRevokeKey()

	const projectMap = Object.fromEntries((projects ?? []).map((p) => [p.id, p.name]))

	return (
		<div className="max-w-4xl">
			<div className="mb-8">
				<h1 className="text-xl font-semibold text-gray-100">API Keys</h1>
				<p className="text-sm text-gray-500 mt-0.5">All API keys across your organization</p>
			</div>

			{isLoading ? (
				<div className="bg-gray-900 border border-gray-800 rounded-lg h-48 animate-pulse" />
			) : !keys || keys.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-24">
					<div className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
						<svg
							width="22"
							height="22"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="text-gray-500"
						>
							<circle cx="7.5" cy="15.5" r="5.5" />
							<path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
						</svg>
					</div>
					<h3 className="text-gray-100 font-medium text-base mb-1">No API keys yet</h3>
					<p className="text-gray-400 text-sm text-center max-w-xs mb-6">
						Create a project first, then generate API keys inside it.
					</p>
					<Link
						to="/dashboard/projects"
						className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
					>
						Go to Projects
					</Link>
				</div>
			) : (
				<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-800">
								<th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">
									Name
								</th>
								<th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">
									Project
								</th>
								<th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">
									Key
								</th>
								<th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">
									Created
								</th>
								<th className="px-4 py-3" />
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-800">
							{keys.map((key) => (
								<tr key={key.id} className="group hover:bg-gray-800/40 transition-colors">
									<td className="px-4 py-3">
										<span className="text-sm font-medium text-gray-200">{key.name}</span>
										<p className="text-xs text-gray-500 mt-0.5">
											{new Date(key.createdAt).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})}
										</p>
									</td>

									<td className="px-4 py-3">
										<Link
											to="/dashboard/projects/$projectId"
											params={{ projectId: key.projectId }}
											className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
										>
											{projectMap[key.projectId] ?? 'Unknown'}
										</Link>
									</td>

									<td className="px-4 py-3">
										<code className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">
											kf_••••••••••••
										</code>
									</td>

									<td className="px-4 py-3">
										<span className="text-xs text-gray-500 tabular-nums">
											{new Date(key.createdAt).toLocaleDateString('en-US', {
												month: 'short',
												day: 'numeric',
												year: 'numeric',
											})}
										</span>
									</td>

									<td className="px-4 py-3 text-right">
										<button
											onClick={() => revokeKey.mutate({ keyId: key.apiKeyId })}
											disabled={revokeKey.isPending}
											className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 hover:text-danger-text transition-all"
										>
											Revoke
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}
