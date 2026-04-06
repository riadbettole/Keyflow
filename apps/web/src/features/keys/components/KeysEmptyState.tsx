type Props = {
	onCreateClick: () => void
}

export function KeysEmptyState({ onCreateClick }: Props) {
	return (
		<div className="flex flex-col items-center justify-center py-20 px-4">
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
					<path d="m21 2-9.6 9.6" />
					<path d="m15.5 7.5 3 3L22 7l-3-3" />
				</svg>
			</div>
			<h3 className="text-gray-100 font-medium text-base mb-1">No API keys yet</h3>
			<p className="text-gray-400 text-sm text-center max-w-xs mb-6">
				Create your first API key to start authenticating requests to this project.
			</p>
			<button
				onClick={onCreateClick}
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
				Create API key
			</button>
		</div>
	)
}
