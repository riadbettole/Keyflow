import type { InvitableRole, Member, TeamRole } from '../types'
import { ROLE_COLORS } from '../types'

type Props = {
	member: Member
	onRemove: (id: string) => void
	onRoleChange: (id: string, role: InvitableRole) => void
	isCurrentUser: boolean
}

export function MemberRow({ member, onRemove, onRoleChange, isCurrentUser }: Props) {
	const initials = member.user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)

	const role = member.role as TeamRole

	const isOwner = role === 'owner'

	return (
		<tr className="group hover:bg-gray-800/40 transition-colors">
			{/* User */}
			<td className="px-4 py-3">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
						<span className="text-xs font-semibold text-indigo-400">{initials}</span>
					</div>
					<div>
						<p className="text-sm font-medium text-gray-200">
							{member.user.name}
							{isCurrentUser && <span className="ml-2 text-xs text-gray-600">(you)</span>}
						</p>
						<p className="text-xs text-gray-500">{member.user.email}</p>
					</div>
				</div>
			</td>

			{/* Role */}
			<td className="px-4 py-3">
				{isOwner ? (
					<span className={`text-xs font-medium px-2 py-1 rounded-md ${ROLE_COLORS.owner}`}>
						Owner
					</span>
				) : (
					<select
						value={role}
						onChange={(e) => onRoleChange(member.id, e.target.value as InvitableRole)}
						disabled={isCurrentUser}
						className={`
      text-xs font-medium px-2 py-1 rounded-md border-0
      focus:outline-none focus:ring-1 focus:ring-indigo-500
      ${ROLE_COLORS[role]}
      disabled:opacity-50 disabled:cursor-not-allowed
      bg-transparent cursor-pointer
    `}
					>
						<option value="admin">Admin</option>
						<option value="member">Member</option>
					</select>
				)}
			</td>

			{/* Joined */}
			<td className="px-4 py-3">
				<span className="text-xs text-gray-500 tabular-nums">
					{new Date(member.createdAt).toLocaleDateString('en-US', {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
					})}
				</span>
			</td>

			{/* Remove */}
			<td className="px-4 py-3 text-right">
				{!isCurrentUser && !isOwner && (
					<button
						onClick={() => onRemove(member.id)}
						className="opacity-0 group-hover:opacity-100 text-xs text-gray-500 hover:text-danger-text transition-all"
					>
						Remove
					</button>
				)}
			</td>
		</tr>
	)
}
