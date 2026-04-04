import { createFileRoute } from '@tanstack/react-router'

import { trpc } from '../../shared/trpc'

export function TestComponent() {
	const hello = trpc.health.ping.useQuery()
	if (hello.isLoading) return <div>Checking tRPC connection...</div>
	if (hello.error) return <div>Error: {hello.error.message}</div>

	return (
		<div style={{ padding: '1rem', border: '1px solid green' }}>
			<h1>tRPC Status: Connected!</h1>
			<pre>{JSON.stringify(hello.data, null, 2)}</pre>
		</div>
	)
}

export const Route = createFileRoute('/dashboard/')({
	component: TestComponent,
})
