import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CreateProjectModal } from '@/features/projects/components/CreateProjectModal'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { ProjectsEmptyState } from '@/features/projects/components/ProjectsEmptyState'
import { useDeleteProject, useProjects } from '@/features/projects/useProjects'

export const Route = createFileRoute('/dashboard/projects/')({
	component: ProjectsPage,
})

function ProjectsPage() {
	const [modalOpen, setModalOpen] = useState(false)
	const { data: projects, isLoading } = useProjects()
	const deleteProject = useDeleteProject()

	function handleDelete(id: string) {
		deleteProject.mutate({ id })
	}

	return (
		<>
			<div className="max-w-5xl">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-xl font-semibold text-gray-100">Projects</h1>
						<p className="text-sm text-gray-400 mt-0.5">Organize your API keys by project</p>
					</div>

					{projects && projects.length > 0 && (
						<button
							onClick={() => setModalOpen(true)}
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
							New project
						</button>
					)}
				</div>

				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="bg-gray-900 border border-gray-800 rounded-lg p-5 h-36 animate-pulse" />
						<div className="bg-gray-900 border border-gray-800 rounded-lg p-5 h-36 animate-pulse" />
						<div className="bg-gray-900 border border-gray-800 rounded-lg p-5 h-36 animate-pulse" />
					</div>
				) : projects?.length === 0 ? (
					<ProjectsEmptyState onCreateClick={() => setModalOpen(true)} />
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{projects?.map((project) => (
							<ProjectCard key={project.id} project={project} onDelete={handleDelete} />
						))}
					</div>
				)}
			</div>

			<CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
		</>
	)
}
