// apps/web/src/routes/dashboard/billing.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PlanCard } from '@/features/billing/components/PlanCard'
import type { Plan } from '@/features/billing/types'
import { useCreateCheckout, useCreatePortal, useSubscription } from '@/features/billing/useBilling'

export const Route = createFileRoute('/dashboard/billing/')({
	component: BillingPage,
})

function BillingPage() {
	const { data: subscription, isLoading } = useSubscription()
	const checkout = useCreateCheckout()
	const portal = useCreatePortal()

	const currentPlan = (subscription?.plan ?? 'free') as Plan

	return (
		<div className="max-w-3xl">
			<div className="mb-8">
				<h1 className="text-xl font-semibold text-gray-100">Billing</h1>
				<p className="text-sm text-gray-400 mt-0.5">Manage your plan and subscription</p>
			</div>

			{isLoading ? (
				<div className="grid grid-cols-2 gap-4">
					{[...Array(2)].map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <static>
							key={i}
							className="bg-gray-900 border border-gray-800 rounded-lg h-64 animate-pulse"
						/>
					))}
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 gap-4 mb-8">
						<PlanCard plan="free" current={currentPlan === 'free'} />
						<PlanCard
							plan="pro"
							current={currentPlan === 'pro'}
							onUpgrade={() => checkout.mutate()}
							onManage={() => portal.mutate()}
							loading={checkout.isPending || portal.isPending}
						/>
					</div>

					{subscription?.currentPeriodEnd && (
						<p className="text-sm text-gray-500">
							Current period ends{' '}
							{new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</p>
					)}
				</>
			)}
		</div>
	)
}
