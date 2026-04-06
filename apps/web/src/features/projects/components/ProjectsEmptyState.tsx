type Props = {
	onCreateClick: () => void
}

export function ProjectsEmptyState({ onCreateClick }: Props) {
	return (
		<div className="flex flex-col items-center justify-center py-24 px-4">
			<div className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-gray-500"
				>
					<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
				</svg>
			</div>

			<h3 className="text-gray-100 font-medium text-base mb-1">No projects yet</h3>
			<p className="text-gray-400 text-sm text-center max-w-xs mb-6">
				Projects help you organize your API keys. Create one to get started.
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
				Create project
			</button>
		</div>
	)
}
