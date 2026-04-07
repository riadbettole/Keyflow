type Props = {
	onCreateClick: () => void
}

export function WebhooksEmptyState({ onCreateClick }: Props) {
	return (
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
					<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
					<path d="M13.73 21a2 2 0 0 1-3.46 0" />
				</svg>
			</div>
			<h3 className="text-gray-100 font-medium text-base mb-1">No webhooks yet</h3>
			<p className="text-gray-400 text-sm text-center max-w-xs mb-6">
				Register a URL to receive real-time notifications when events occur.
			</p>
			<button
				onClick={onCreateClick}
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
		</div>
	)
}
