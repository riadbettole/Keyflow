import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/shared/lib/auth'
import { trpc } from '@/shared/lib/trpc'

export const Route = createFileRoute('/dashboard/settings/')({
	component: SettingsPage,
})

function SettingsPage() {
	const router = useRouter()
	const { data: session } = authClient.useSession()
	const [deleteConfirm, setDeleteConfirm] = useState('')

	const exportData = trpc.settings.exportData.useQuery(undefined, {
		enabled: false, // only fetch on demand
	})

	async function handleExport() {
		const result = await exportData.refetch()
		if (!result.data) return

		const blob = new Blob([JSON.stringify(result.data, null, 2)], {
			type: 'application/json',
		})
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `keyflow-export-${new Date().toISOString().split(`T`)[0]}.json`
		a.click()
		URL.revokeObjectURL(url)
		toast.success('Data exported successfully')
	}
	const deleteAccountMutation = trpc.settings.deleteAccount.useMutation()

	async function handleDeleteAccount() {
		if (deleteConfirm !== session?.user?.email) {
			toast.error('Email does not match')
			return
		}

		try {
			await deleteAccountMutation.mutateAsync()
			await authClient.deleteUser()
			router.navigate({ to: '/' })
			toast.success('Account deleted')
		} catch {
			toast.error('Failed to delete account')
		}
	}

	const inputClass = `
    w-full px-3 py-2 rounded-md text-sm
    bg-gray-800 border border-gray-700
    text-gray-100 placeholder:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    transition-colors
  `

	return (
		<div className="max-w-2xl space-y-8">
			<div>
				<h1 className="text-xl font-semibold text-gray-100">Settings</h1>
				<p className="text-sm text-gray-500 mt-0.5">Manage your account and organization</p>
			</div>

			{/* GDPR — Data export */}
			<section className="bg-gray-900 border border-gray-700 rounded-lg p-6">
				<h2 className="text-sm font-semibold text-gray-300 mb-1">Export your data</h2>
				<p className="text-xs text-gray-500 mb-4 leading-relaxed">
					Download a copy of all your data including projects, API keys, webhooks, audit logs, and
					usage history. In accordance with GDPR Article 20 (Right to data portability).
				</p>
				<button
					onClick={handleExport}
					disabled={exportData.isFetching}
					className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors disabled:opacity-50"
				>
					{exportData.isFetching ? (
						'Preparing export...'
					) : (
						<>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
							Export data as JSON
						</>
					)}
				</button>
			</section>

			{/* GDPR — Danger zone */}
			<section className="bg-gray-900 border border-danger/30 rounded-lg p-6">
				<h2 className="text-sm font-semibold text-danger-text mb-1">Danger zone</h2>
				<p className="text-xs text-gray-500 mb-4 leading-relaxed">
					Permanently delete your account and all associated data. This action cannot be undone. In
					accordance with GDPR Article 17 (Right to erasure).
				</p>

				<div className="space-y-3">
					<div className="space-y-1.5">
						<label className="block text-xs font-medium text-gray-500">
							Type your email to confirm:{' '}
							<span className="text-gray-400 font-mono">{session?.user?.email}</span>
						</label>
						<input
							type="email"
							value={deleteConfirm}
							onChange={(e) => setDeleteConfirm(e.target.value)}
							placeholder={session?.user?.email ?? ''}
							className={`${inputClass} border-danger/30 focus:ring-danger`}
						/>
					</div>

					<button
						onClick={handleDeleteAccount}
						disabled={deleteConfirm !== session?.user?.email}
						className="
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
              border border-danger/40 text-danger-text
              hover:bg-danger-muted transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
            "
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
						</svg>
						Delete my account
					</button>
				</div>
			</section>
		</div>
	)
}
