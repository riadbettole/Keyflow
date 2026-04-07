import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { authClient } from '@/shared/lib/auth'

export const Route = createFileRoute('/accept-invite')({
	component: AcceptInvitePage,
})

function AcceptInvitePage() {
	const navigate = useNavigate()
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
	const search = new URLSearchParams(window.location.search)
	const token = search.get('token')

	useEffect(() => {
		if (!token) {
			setStatus('error')
			return
		}

		authClient.organization
			.acceptInvitation({
				invitationId: token,
			})
			.then(() => {
				setStatus('success')
				setTimeout(() => navigate({ to: '/dashboard' }), 2000)
			})
			.catch(() => setStatus('error'))
	}, [token, navigate])

	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center">
			<div className="text-center">
				{status === 'loading' && <p className="text-gray-400">Accepting invitation...</p>}
				{status === 'success' && (
					<>
						<p className="text-success-text font-medium mb-1">Invitation accepted</p>
						<p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
					</>
				)}
				{status === 'error' && (
					<>
						<p className="text-danger-text font-medium mb-1">Invalid or expired invitation</p>
						<p className="text-gray-500 text-sm">Please ask for a new invite link.</p>
					</>
				)}
			</div>
		</div>
	)
}
