import { trpc } from '@/shared/lib/trpc'

export function useProjects() {
	return trpc.projects.list.useQuery()
}

export function useCreateProject() {
	const utils = trpc.useUtils()

	return trpc.projects.create.useMutation({
		onSuccess: () => {
			utils.projects.list.invalidate()
		},
	})
}

export function useDeleteProject() {
	const utils = trpc.useUtils()

	return trpc.projects.delete.useMutation({
		onSuccess: () => {
			utils.projects.list.invalidate()
		},
	})
}
