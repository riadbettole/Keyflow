import { TRPCClientError } from '@trpc/client'
import { toast } from 'sonner'
import { trpc } from '@/shared/lib/trpc'

export function useTeam() {
	return trpc.team.list.useQuery()
}

export function useInviteMember() {
	const utils = trpc.useUtils()

	return trpc.team.invite.useMutation({
		onSuccess: (data) => {
			utils.team.list.invalidate()
			toast.success(`${data.email} added to the organization`)
		},
		onError: (err) => {
			if (err instanceof TRPCClientError && err.data?.code === 'NOT_FOUND') {
				toast.error('No Keyflow account found for this email address')
			} else {
				toast.error('Failed to add member')
			}
		},
	})
}

export function useRemoveMember() {
	const utils = trpc.useUtils()

	return trpc.team.remove.useMutation({
		onSuccess: () => {
			utils.team.list.invalidate()
			toast.success('Member removed')
		},
		onError: () => {
			toast.error('Failed to remove member')
		},
	})
}

export function useUpdateRole() {
	const utils = trpc.useUtils()

	return trpc.team.updateRole.useMutation({
		onSuccess: () => {
			utils.team.list.invalidate()
			toast.success('Role updated')
		},
		onError: () => {
			toast.error('Failed to update role')
		},
	})
}
