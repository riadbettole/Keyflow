import { Link } from '@tanstack/react-router'
import type { Project } from '../types'

type Props = {
	project: Project
	onDelete: (id: string) => void
}

export function ProjectCard({ project, onDelete }: Props) {
	return (
		<div
			className="
      bg-gray-900 border border-gray-700 rounded-lg p-5
      hover:border-gray-600 transition-colors group
    "
		>
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="text-indigo-400"
						>
							<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
						</svg>
					</div>
					<h3 className="text-gray-100 font-medium text-sm">{project.name}</h3>
				</div>

				<button
					onClick={() => onDelete(project.id)}
					className="
            opacity-0 group-hover:opacity-100
            p-1.5 rounded-md text-gray-500
            hover:text-danger hover:bg-gray-800
            transition-all
          "
					title="Delete project"
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

			{project.description && (
				<p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
			)}

			<div className="flex items-center justify-between pt-3 border-t border-gray-800">
				<span className="text-gray-500 text-xs">
					{new Date(project.createdAt).toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
					})}
				</span>

				<Link
					to="/dashboard/projects/$projectId"
					params={{ projectId: project.id }}
					className="
            text-xs text-indigo-400 font-medium
            hover:text-indigo-300 transition-colors
            flex items-center gap-1
          "
				>
					View keys
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
					>
						<path d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</Link>
			</div>
		</div>
	)
}
