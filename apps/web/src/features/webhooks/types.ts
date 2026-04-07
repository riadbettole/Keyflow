export type Webhook = {
	id: string
	organizationId: string
	url: string
	secret: string
	events: string
	enabled: boolean
	createdAt: string
	updatedAt: string
}

export type CreateWebhookInput = {
	url: string
	events: WebhookEvent[]
}

export type WebhookEvent =
	| 'key.rate_limit_exceeded'
	| 'key.expired'
	| 'key.revoked'
	| 'project.created'
	| '*'

export const WEBHOOK_EVENTS: { value: WebhookEvent; label: string }[] = [
	{ value: 'key.rate_limit_exceeded', label: 'Rate limit exceeded' },
	{ value: 'key.expired', label: 'Key expired' },
	{ value: 'key.revoked', label: 'Key revoked' },
	{ value: 'project.created', label: 'Project created' },
	{ value: '*', label: 'All events' },
]
