export type Project = {
	id: string
	name: string
	description: string | null
	organizationId: string
	createdAt: string
	updatedAt: string
}

export type CreateProjectInput = {
	name: string
	description?: string
}
