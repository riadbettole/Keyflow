import { useState } from 'react'
import type { WebhookEvent } from '../types'
import { WEBHOOK_EVENTS } from '../types'
import { useCreateWebhook } from '../useWebhooks'

type Props = {
	open: boolean
	onClose: () => void
	onCreated: (secret: string, url: string) => void
}

export function CreateWebhookModal({ open, onClose, onCreated }: Props) {
	const [url, setUrl] = useState('')
	const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([])
	const createWebhook = useCreateWebhook()

	if (!open) return null

	function toggleEvent(value: WebhookEvent) {
		setSelectedEvents((prev) =>
			prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value],
		)
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const result = await createWebhook.mutateAsync({
			url,
			events: selectedEvents,
		})
		setUrl('')
		setSelectedEvents([])
		onCreated(result.secret, result.url)
	}

	return (
		<>
			<button className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
			<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6">
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-gray-100 font-semibold text-base">Add webhook</h2>
					<button
						onClick={onClose}
						className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label className="block text-sm font-medium text-gray-300">Endpoint URL</label>
						<input
							type="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://your-api.com/webhooks"
							required
							className="w-full px-3 py-2 rounded-md text-sm bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-300">Events to send</label>
						<div className="space-y-2">
							{WEBHOOK_EVENTS.map((opt) => (
								<label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
									<input
										type="checkbox"
										checked={selectedEvents.includes(opt.value)}
										onChange={() => toggleEvent(opt.value)}
										className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900"
									/>
									<span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
										{opt.label}
										<code className="ml-2 text-xs text-gray-500 font-mono">{opt.value}</code>
									</span>
								</label>
							))}
						</div>
					</div>

					{createWebhook.error && (
						<p className="text-sm text-danger-text">Something went wrong, please try again</p>
					)}

					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={createWebhook.isPending || !url || selectedEvents.length === 0}
							className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{createWebhook.isPending ? 'Creating...' : 'Create webhook'}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}
