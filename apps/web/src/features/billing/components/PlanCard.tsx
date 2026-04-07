// apps/web/src/features/billing/components/PlanCard.tsx
import type { Plan } from '../types'
import { PLAN_FEATURES } from '../types'

type Props = {
	plan: Plan
	current: boolean
	onUpgrade?: () => void
	onManage?: () => void
	loading?: boolean
}

export function PlanCard({ plan, current, onUpgrade, onManage, loading }: Props) {
	const isPro = plan === 'pro'

	return (
		<div
			className={`
      bg-gray-900 border rounded-lg p-6 relative
      ${
				isPro
					? 'border-indigo-500/50 bg-linear-to-b from-indigo-500/5 to-transparent'
					: 'border-gray-700'
			}
      ${current ? 'ring-1 ring-indigo-500/30' : ''}
    `}
		>
			{current && (
				<span className="absolute -top-3 left-4 text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-500 text-white">
					Current plan
				</span>
			)}

			<div className="mb-5">
				<p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{plan}</p>
				<p className="text-4xl font-bold text-gray-100">
					{isPro ? '$49' : '$0'}
					<span className="text-sm font-normal text-gray-500 ml-1">/month</span>
				</p>
			</div>

			<ul className="space-y-2.5 mb-6">
				{PLAN_FEATURES[plan].map((feature) => (
					<li key={feature} className="flex items-center gap-2.5 text-sm text-gray-400">
						<svg
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							className="text-success-text shrink-0"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						{feature}
					</li>
				))}
			</ul>

			{current ? (
				isPro && onManage ? (
					<button
						onClick={onManage}
						disabled={loading}
						className="w-full py-2 px-4 rounded-md text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50"
					>
						{loading ? 'Loading...' : 'Manage subscription'}
					</button>
				) : null
			) : (
				onUpgrade && (
					<button
						onClick={onUpgrade}
						disabled={loading}
						className="w-full py-2 px-4 rounded-md text-sm font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors disabled:opacity-50"
					>
						{loading ? 'Loading...' : 'Upgrade to Pro'}
					</button>
				)
			)}
		</div>
	)
}
