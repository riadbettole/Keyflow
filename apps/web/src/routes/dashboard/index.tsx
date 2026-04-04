import { createFileRoute } from '@tanstack/react-router'

import { trpc } from '../../shared/lib/trpc'

export function TestComponent() {
	const hello = trpc.health.ping.useQuery()
	if (hello.isLoading) return <div>Checking tRPC connection...</div>
	if (hello.error) return <div>Error: {hello.error.message}</div>

	return (
		<div className="border-green-400 border-2 p-10">
			<h1>tRPC Status: Connected!</h1>
			<pre>{JSON.stringify(hello.data, null, 2)}</pre>
		</div>
	)
}

export const Route = createFileRoute('/dashboard/')({
	component: TestComponent,
})
