// apps/web/src/routes/dashboard/webhooks.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateWebhookModal } from '@/features/webhooks/components/CreateWebhookModal'
import { SecretRevealModal } from '@/features/webhooks/components/SecretRevealModal'
import { WebhookCard } from '@/features/webhooks/components/WebhookCard'
import { WebhooksEmptyState } from '@/features/webhooks/components/WebhooksEmptyState'
import { useDeleteWebhook, useToggleWebhook, useWebhooks } from '@/features/webhooks/useWebhooks'

export const Route = createFileRoute('/dashboard/webhooks/')({
	component: WebhooksPage,
})

function WebhooksPage() {
	const [createOpen, setCreateOpen] = useState(false)
	const [revealedSecret, setRevealedSecret] = useState<{
		secret: string
		url: string
	} | null>(null)

	const { data: webhooks, isLoading } = useWebhooks()
	const deleteWebhook = useDeleteWebhook()
	const toggleWebhook = useToggleWebhook()

	return (
		<>
			<div className="max-w-3xl">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-xl font-semibold text-gray-100">Webhooks</h1>
						<p className="text-sm text-gray-400 mt-0.5">
							Get notified when events happen in your organization
						</p>
					</div>
					{webhooks && webhooks.length > 0 && (
						<button
							onClick={() => setCreateOpen(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
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
							Add webhook
						</button>
					)}
				</div>

				{isLoading ? (
					<div className="space-y-3">
						{[...Array(2)].map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <static component>
								key={i}
								className="bg-gray-900 border border-gray-800 rounded-lg h-20 animate-pulse"
							/>
						))}
					</div>
				) : !webhooks || webhooks.length === 0 ? (
					<WebhooksEmptyState onCreateClick={() => setCreateOpen(true)} />
				) : (
					<div className="space-y-3">
						{webhooks.map((wh) => (
							<WebhookCard
								key={wh.id}
								webhook={wh}
								onDelete={(id) => deleteWebhook.mutate({ id })}
								onToggle={(id, enabled) => toggleWebhook.mutate({ id, enabled })}
							/>
						))}
					</div>
				)}
			</div>

			<CreateWebhookModal
				open={createOpen}
				onClose={() => setCreateOpen(false)}
				onCreated={(secret, url) => {
					setCreateOpen(false)
					setRevealedSecret({ secret, url })
				}}
			/>

			{revealedSecret && (
				<SecretRevealModal
					url={revealedSecret.url}
					secret={revealedSecret.secret}
					onClose={() => setRevealedSecret(null)}
				/>
			)}
		</>
	)
}
