import { useState } from 'react'
import type { CreatedKey } from '../types'

type Props = {
	createdKey: CreatedKey | null
	onClose: () => void
}

export function KeyRevealModal({ createdKey, onClose }: Props) {
	const [copied, setCopied] = useState(false)

	if (!createdKey) return null

	async function handleCopy() {
		if (!createdKey) return null
		await navigator.clipboard.writeText(createdKey.key)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<>
			<div className="fixed inset-0 bg-black/70 z-40" />

			<div
				className="
        fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        w-full max-w-md z-50
        bg-gray-900 border border-gray-700 rounded-xl shadow-xl
        p-6
      "
			>
				<div className="flex items-center gap-3 mb-5">
					<div className="w-9 h-9 rounded-lg bg-success-muted border border-success/20 flex items-center justify-center shrink-0">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="text-success-text"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
					</div>
					<div>
						<h2 className="text-gray-100 font-semibold text-base">API key created</h2>
						<p className="text-gray-400 text-xs mt-0.5">{createdKey.name}</p>
					</div>
				</div>

				<div className="bg-warning-muted border border-warning/20 rounded-lg px-4 py-3 mb-4">
					<p className="text-warning-text text-xs leading-relaxed">
						Copy this key now — it will never be shown again. Store it somewhere safe like a
						password manager or secrets vault.
					</p>
				</div>

				<div className="bg-gray-950 border border-gray-700 rounded-lg p-3 mb-4 flex items-center gap-3">
					<code className="flex-1 text-xs font-mono text-gray-200 break-all select-all">
						{createdKey.key}
					</code>
					<button
						onClick={handleCopy}
						className="shrink-0 p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
						title="Copy to clipboard"
					>
						{copied ? (
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								className="text-success-text"
							>
								<polyline points="20 6 9 17 4 12" />
							</svg>
						) : (
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<rect x="9" y="9" width="13" height="13" rx="2" />
								<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
							</svg>
						)}
					</button>
				</div>

				<button
					onClick={onClose}
					className="
            w-full py-2 px-4 rounded-md text-sm font-medium
            bg-gray-800 hover:bg-gray-700
            text-gray-200 transition-colors
          "
				>
					I've saved my key
				</button>
			</div>
		</>
	)
}
