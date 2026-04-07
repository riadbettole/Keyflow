export type Plan = 'free' | 'pro'

export type Subscription = {
	plan: Plan
	status: string
	currentPeriodEnd: string | null
	stripeCustomerId: string | null
	stripeSubscriptionId: string | null
}

export const PLAN_FEATURES = {
	free: ['3 projects', '10 API keys', '10,000 requests / month', 'Basic audit logs'],
	pro: [
		'Unlimited projects',
		'Unlimited API keys',
		'1,000,000 requests / month',
		'Full audit logs',
		'Webhook delivery logs',
		'Priority support',
	],
}
