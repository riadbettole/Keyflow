import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateKeyModal } from '@/features/keys/components/CreateKeyModal'
import { KeyRevealModal } from '@/features/keys/components/KeyRevealModal'
import { KeysEmptyState } from '@/features/keys/components/KeysEmptyState'
import { KeysTable } from '@/features/keys/components/KeysTable'
import type { CreatedKey } from '@/features/keys/types'
import { useKeys, useRevokeKey } from '@/features/keys/useKeys'
import { trpc } from '@/shared/lib/trpc'

export const Route = createFileRoute('/dashboard/projects/$projectId')({
	component: ProjectDetailPage,
})

function ProjectDetailPage() {
	const { projectId } = Route.useParams()
	const [createOpen, setCreateOpen] = useState(false)
	const [revealedKey, setRevealedKey] = useState<CreatedKey | null>(null)

	const { data: project } = trpc.projects.get.useQuery({ id: projectId })
	const { data: allKeys, isLoading } = useKeys()
	const revokeKey = useRevokeKey()

	// filter keys for this project
	const keys = allKeys?.filter((k) => k.projectId === projectId) ?? []

	function handleRevoke(keyId: string) {
		revokeKey.mutate({ keyId })
	}

	return (
		<>
			<div className="max-w-4xl">
				<div className="mb-8">
					<Link
						to="/dashboard/projects"
						className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M19 12H5M12 5l-7 7 7 7" />
						</svg>
						Projects
					</Link>

					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-semibold text-gray-100">{project?.name ?? '...'}</h1>
							{project?.description && (
								<p className="text-sm text-gray-400 mt-0.5">{project.description}</p>
							)}
						</div>

						{keys.length > 0 && (
							<button
								onClick={() => setCreateOpen(true)}
								className="
                  flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                  bg-indigo-500 hover:bg-indigo-400 text-white transition-colors
                "
							>
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
								New key
							</button>
						)}
					</div>
				</div>

				<div>
					<h2 className="text-sm font-medium text-gray-400 mb-3">
						API Keys
						{keys.length > 0 && <span className="ml-2 text-gray-600">{keys.length}</span>}
					</h2>

					{isLoading ? (
						<div className="bg-gray-900 border border-gray-800 rounded-lg h-32 animate-pulse" />
					) : keys.length === 0 ? (
						<KeysEmptyState onCreateClick={() => setCreateOpen(true)} />
					) : (
						<KeysTable keys={keys} onRevoke={handleRevoke} isRevoking={revokeKey.isPending} />
					)}
				</div>
			</div>

			<CreateKeyModal
				open={createOpen}
				projectId={projectId}
				onClose={() => setCreateOpen(false)}
				onCreated={(key) => setRevealedKey(key)}
			/>

			<KeyRevealModal createdKey={revealedKey} onClose={() => setRevealedKey(null)} />
		</>
	)
}
