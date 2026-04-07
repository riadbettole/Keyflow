export type Member = {
	id: string
	role: string
	createdAt: string
	userId: string
	organizationId: string
	user: {
		id: string
		name: string
		email: string
		image?: string | null | undefined
	}
}

export type TeamRole = 'admin' | 'member' | 'owner'
export type InvitableRole = 'admin' | 'member'

export const ROLE_LABELS: Record<TeamRole, string> = {
	owner: 'Owner',
	admin: 'Admin',
	member: 'Member',
}

export const ROLE_COLORS: Record<TeamRole, string> = {
	owner: 'text-indigo-400 bg-indigo-500/10',
	admin: 'text-teal-400 bg-teal-500/10',
	member: 'text-gray-400 bg-gray-800',
}
