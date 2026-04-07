// apps/web/src/routes/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: LandingPage,
})

function LandingPage() {
	return (
		<div className="min-h-screen bg-gray-950 text-gray-100">
			{/* Nav */}
			<nav className="border-b border-gray-800">
				<div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center">
							<span className="text-white font-bold text-xs">K</span>
						</div>
						<span className="font-semibold text-sm">Keyflow</span>
					</div>
					<div className="flex items-center gap-4">
						<a
							href="https://github.com/riadbettole/keyflow"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
						>
							GitHub
						</a>
						<Link
							to="/login"
							className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
						>
							Sign in
						</Link>
						<Link
							to="/register"
							className="text-sm font-medium px-4 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
						>
							Get started
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero */}
			<section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
				<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
					<span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
					Open source · Built with Bun + Hono + React
				</div>

				<h1 className="text-5xl font-bold text-gray-100 leading-tight mb-4">
					API key management
					<br />
					<span className="text-indigo-400">for developers</span>
				</h1>

				<p className="text-lg text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
					Issue API keys, track usage, enforce rate limits, and receive webhooks — without building
					any of it yourself.
				</p>

				<div className="flex items-center justify-center gap-3">
					<Link
						to="/register"
						className="px-6 py-2.5 rounded-md font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
					>
						Get started free
					</Link>
					<a
						href="https://github.com/riadbettole/keyflow"
						target="_blank"
						rel="noopener noreferrer"
						className="px-6 py-2.5 rounded-md font-medium border border-gray-700 text-gray-300 hover:border-gray-600 hover:text-gray-100 transition-colors flex items-center gap-2"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
						</svg>
						View on GitHub
					</a>
				</div>
			</section>

			{/* SDK example */}
			<section className="max-w-4xl mx-auto px-6 pb-20">
				<div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
					<div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
						<div className="w-3 h-3 rounded-full bg-red-500/60" />
						<div className="w-3 h-3 rounded-full bg-amber-500/60" />
						<div className="w-3 h-3 rounded-full bg-emerald-500/60" />
						<span className="text-xs text-gray-500 ml-2 font-mono">middleware.ts</span>
					</div>
					<pre className="p-6 text-sm font-mono overflow-auto">
						<code className="text-gray-300">
							{`import { KeyflowClient } from '@keyflow/sdk'

const keyflow = new KeyflowClient({
  baseUrl: 'https://your-keyflow.com'
})

// Protect your API in one line
app.use(async (req, res, next) => {
  const result = await keyflow.keys.verify(
    req.headers['x-api-key']
  )

  if (!result.valid) {
    return res.status(401).json({ 
      error: result.reason 
    })
  }

  next()
})`}
						</code>
					</pre>
				</div>
			</section>

			{/* How it works */}
			<section className="max-w-4xl mx-auto px-6 pb-20">
				<h2 className="text-2xl font-semibold text-gray-100 text-center mb-12">How it works</h2>
				<div className="grid grid-cols-3 gap-8">
					{[
						{
							step: '01',
							title: 'Create a project',
							description: 'Organize your API keys by product or service',
						},
						{
							step: '02',
							title: 'Generate API keys',
							description: 'Issue keys with built-in rate limiting and expiration',
						},
						{
							step: '03',
							title: 'Integrate the SDK',
							description: 'Validate keys in your API with a single function call',
						},
					].map((item) => (
						<div key={item.step} className="text-center">
							<div className="text-3xl font-bold text-indigo-500/30 mb-3 font-mono">
								{item.step}
							</div>
							<h3 className="font-semibold text-gray-200 mb-2">{item.title}</h3>
							<p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* Features */}
			<section className="max-w-4xl mx-auto px-6 pb-24">
				<h2 className="text-2xl font-semibold text-gray-100 text-center mb-12">
					Everything you need
				</h2>
				<div className="grid grid-cols-2 gap-4">
					{[
						{
							title: 'Sliding window rate limiting',
							description:
								'Redis-backed rate limits per key. No burst abuse, no fixed window vulnerabilities.',
							accent: 'border-t-indigo-500',
						},
						{
							title: 'Webhook delivery',
							description:
								'Get notified when keys hit limits or expire. HMAC-signed, retried automatically.',
							accent: 'border-t-teal-500',
						},
						{
							title: 'Usage tracking',
							description: 'Every request logged to MongoDB. See who used what and when.',
							accent: 'border-t-indigo-400',
						},
						{
							title: 'Audit logs',
							description: 'Immutable record of every action in your organization. GDPR compliant.',
							accent: 'border-t-indigo-500',
						},
						{
							title: 'Organization RBAC',
							description: 'Teams with typed roles. Keys belong to orgs, not individuals.',
							accent: 'border-t-teal-500',
						},
						{
							title: 'Stripe billing',
							description: 'Usage-based billing with idempotent webhook processing.',
							accent: 'border-t-indigo-400',
						},
					].map((feature) => (
						<div
							key={feature.title}
							className={`bg-gray-900 border border-gray-700 border-t-2 ${feature.accent} rounded-lg p-5`}
						>
							<h3 className="font-medium text-gray-200 mb-1.5">{feature.title}</h3>
							<p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA */}
			<section className="border-t border-gray-800">
				<div className="max-w-4xl mx-auto px-6 py-20 text-center">
					<h2 className="text-2xl font-semibold text-gray-100 mb-3">Ready to ship?</h2>
					<p className="text-gray-500 mb-8">Start issuing API keys in minutes.</p>
					<Link
						to="/register"
						className="px-8 py-3 rounded-md font-medium bg-indigo-500 hover:bg-indigo-400 text-white transition-colors"
					>
						Get started free
					</Link>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gray-800">
				<div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-5 h-5 rounded bg-indigo-500 flex items-center justify-center">
							<span className="text-white font-bold text-xs">K</span>
						</div>
						<span className="text-sm text-gray-500">Keyflow</span>
					</div>
					<p className="text-xs text-gray-600">Built with Bun, Hono, React, and Turborepo</p>
				</div>
			</footer>
		</div>
	)
}
