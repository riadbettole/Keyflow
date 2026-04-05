import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/keys')({
	component: KeysPage,
})

function KeysPage() {
	return (
		<div>
			<h1 className="text-xl font-semibold text-gray-100">API Keys</h1>
		</div>
	)
}
