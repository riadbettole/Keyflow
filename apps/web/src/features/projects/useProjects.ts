import { toast } from 'sonner'
import { trpc } from '@/shared/lib/trpc'

export function useProjects() {
	return trpc.projects.list.useQuery()
}

export function useCreateProject() {
	const utils = trpc.useUtils()

	return trpc.projects.create.useMutation({
		onSuccess: (project) => {
			utils.projects.list.invalidate()
			toast.success(`Project "${project.name}" created`)
		},
		onError: () => {
			toast.error('Failed to create project')
		},
	})
}

export function useDeleteProject() {
	const utils = trpc.useUtils()

	return trpc.projects.delete.useMutation({
		onSuccess: () => {
			utils.projects.list.invalidate()
			toast.success('Project deleted')
		},
		onError: () => {
			toast.error('Failed to delete project')
		},
	})
}
