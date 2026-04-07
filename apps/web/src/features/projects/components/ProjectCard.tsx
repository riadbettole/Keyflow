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
      border-t-2 border-t-indigo-500
    "
		>
			<div className="flex items-start justify-between mb-2">
				<h3 className="text-sm font-semibold text-gray-100">{project.name}</h3>

				<button
					onClick={() => onDelete(project.id)}
					className="
            opacity-0 group-hover:opacity-100
            p-1.5 rounded-md
            text-gray-600 hover:text-danger-text hover:bg-gray-800
            transition-all
          "
					title="Delete project"
				>
					<svg
						width="13"
						height="13"
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
				<p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
					{project.description}
				</p>
			)}

			<div className="flex items-center justify-between pt-3 border-t border-gray-800">
				<span className="text-xs text-gray-600 tabular-nums">
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
            text-xs font-medium text-indigo-400
            hover:text-indigo-300 transition-colors
            flex items-center gap-1
          "
				>
					View keys
					<svg
						width="11"
						height="11"
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
