export type ApiKey = {
	id: string
	name: string
	projectId: string
	organizationId: string
	createdAt: string
}

export type CreatedKey = ApiKey & {
	key: string // only available at creation time
}

export type CreateKeyInput = {
	projectId: string
	name: string
}
