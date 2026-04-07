import { useState } from 'react'
import type { InvitableRole } from '../types'
import { useInviteMember } from '../useTeam'

type Props = {
	open: boolean
	onClose: () => void
}

export function InviteMemberModal({ open, onClose }: Props) {
	const [email, setEmail] = useState('')
	const [role, setRole] = useState<InvitableRole>('member')
	const invite = useInviteMember()

	if (!open) return null

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		await invite.mutateAsync({ email, role })
		handleClose()
	}

	function handleClose() {
		setEmail('')
		setRole('member')
		onClose()
	}

	return (
		<>
			<button className="fixed inset-0 bg-black/60 z-40" onClick={handleClose} />
			<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6">
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-gray-100 font-semibold text-base">Add team member</h2>
					<button
						onClick={handleClose}
						className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Info banner */}
				<div className="bg-gray-800 rounded-lg px-4 py-3 mb-4">
					<p className="text-xs text-gray-400 leading-relaxed">
						The person must already have a Keyflow account. They will be added to your organization
						immediately.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
							Email address
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="colleague@company.com"
							required
							className="w-full px-3 py-2 rounded-md text-sm bg-gray-800 border border-gray-700 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
							Role
						</label>
						<div className="grid grid-cols-2 gap-2">
							{(['member', 'admin'] as InvitableRole[]).map((r) => (
								<label
									key={r}
									className={`
                    flex flex-col gap-1 p-3 rounded-lg border cursor-pointer transition-colors
                    ${
											role === r
												? 'border-indigo-500 bg-indigo-500/10'
												: 'border-gray-700 hover:border-gray-600'
										}
                  `}
								>
									<input
										type="radio"
										name="role"
										value={r}
										checked={role === r}
										onChange={() => setRole(r)}
										className="sr-only"
									/>
									<span className="text-sm font-medium text-gray-200 capitalize">{r}</span>
									<span className="text-xs text-gray-500">
										{r === 'admin' ? 'Full access to all resources' : 'Can view and use API keys'}
									</span>
								</label>
							))}
						</div>
					</div>

					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={invite.isPending || !email}
							className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{invite.isPending ? 'Adding...' : 'Add member'}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}
