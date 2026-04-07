import type { Webhook } from '../types'

type Props = {
	webhook: Webhook
	onDelete: (id: string) => void
	onToggle: (id: string, enabled: boolean) => void
}

export function WebhookCard({ webhook, onDelete, onToggle }: Props) {
	const events = JSON.parse(webhook.events) as string[]

	return (
		<div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
			<div className="flex items-start justify-between gap-4">
				<div className="flex-1 min-w-0">
					<p className="text-sm font-mono text-gray-200 truncate">{webhook.url}</p>

					<div className="flex flex-wrap gap-1.5 mt-2">
						{events.map((e) => (
							<span
								key={e}
								className="text-xs font-medium px-2 py-0.5 rounded bg-gray-800 text-gray-400"
							>
								{e}
							</span>
						))}
					</div>
				</div>

				<div className="flex items-center gap-2 shrink-0">
					<button
						onClick={() => onToggle(webhook.id, !webhook.enabled)}
						className={`
              text-xs px-2.5 py-1 rounded-md font-medium transition-colors
              ${
								webhook.enabled ? 'bg-success-muted text-success-text' : 'bg-gray-800 text-gray-500'
							}
            `}
					>
						{webhook.enabled ? 'Active' : 'Disabled'}
					</button>

					<button
						onClick={() => onDelete(webhook.id)}
						className="p-1.5 rounded-md text-gray-500 hover:text-danger-text hover:bg-gray-800 transition-colors"
					>
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
					</button>
				</div>
			</div>
		</div>
	)
}
