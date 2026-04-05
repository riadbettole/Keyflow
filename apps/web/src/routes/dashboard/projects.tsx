import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/projects')({
	component: ProjectsPage,
})

function ProjectsPage() {
	return (
		<div>
			<h1 className="text-xl font-semibold text-gray-100">Projects</h1>
		</div>
	)
}
