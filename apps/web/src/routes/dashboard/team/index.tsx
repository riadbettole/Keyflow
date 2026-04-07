import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { InviteMemberModal } from '@/features/team/components/InviteMemberModal'
import { MemberRow } from '@/features/team/components/MemberRow'
import { useRemoveMember, useTeam, useUpdateRole } from '@/features/team/useTeam'
import { authClient } from '@/shared/lib/auth'

export const Route = createFileRoute('/dashboard/team/')({
	component: TeamPage,
})

function TeamPage() {
	const [inviteOpen, setInviteOpen] = useState(false)
	const { data: session } = authClient.useSession()
	const { data: members, isLoading } = useTeam()
	const removeMember = useRemoveMember()
	const updateRole = useUpdateRole()

	return (
		<>
			<div className="max-w-3xl">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-xl font-semibold text-gray-100">Team</h1>
						<p className="text-sm text-gray-500 mt-0.5">
							Manage your organization members and roles
						</p>
					</div>
					<button
						onClick={() => setInviteOpen(true)}
						className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
						>
							<path d="M12 5v14M5 12h14" />
						</svg>
						Invite member
					</button>
				</div>

				{/* RBAC explanation — makes it visible to anyone reading */}
				<div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6 flex items-start gap-3">
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-indigo-400 mt-0.5 shrink-0"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M12 16v-4M12 8h.01" />
					</svg>
					<div>
						<p className="text-sm text-gray-300 font-medium mb-0.5">Role-based access control</p>
						<p className="text-xs text-gray-500 leading-relaxed">
							<span className="text-gray-400">Admins</span> can create and manage projects, API
							keys, and webhooks. <span className="text-gray-400">Members</span> can view and use
							existing keys but cannot create or delete resources.
						</p>
					</div>
				</div>

				{isLoading ? (
					<div className="bg-gray-900 border border-gray-800 rounded-lg h-32 animate-pulse" />
				) : (
					<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-800">
									<th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">
										Member
									</th>
									<th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">
										Role
									</th>
									<th className="text-left text-xs font-medium text-gray-500 px-4 py-3 uppercase tracking-wide">
										Joined
									</th>
									<th className="px-4 py-3" />
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-800">
								{members?.map((member) => (
									<MemberRow
										key={member.id}
										member={member}
										isCurrentUser={member.user.id === session?.user?.id}
										onRemove={(id) => removeMember.mutate({ memberId: id })}
										onRoleChange={(id, role) => updateRole.mutate({ memberId: id, role })}
									/>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<InviteMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
		</>
	)
}
