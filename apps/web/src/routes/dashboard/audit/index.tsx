import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/audit/')({
	component: AuditPage,
})

function AuditPage() {
	return (
		<div>
			<h1 className="text-xl font-semibold text-gray-100">Audit Log</h1>
		</div>
	)
}
