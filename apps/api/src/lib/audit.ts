import { mongo } from './mongo'

type AuditAction =
	| { action: 'project.created'; projectId: string; name: string }
	| { action: 'project.deleted'; projectId: string }
	| { action: 'api_key.created'; keyId: string; projectId: string; name: string }
	| { action: 'api_key.revoked'; keyId: string; projectId: string }

type AuditParams = {
	userId: string
	organizationId: string
	event: AuditAction
	ip?: string
}

export async function audit({ userId, organizationId, event, ip }: AuditParams) {
	await mongo.collection('audit_logs').insertOne({
		userId,
		organizationId,
		...event,
		ip: ip ?? 'unknown',
		timestamp: new Date(),
	})
}
