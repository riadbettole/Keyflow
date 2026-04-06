import { useState } from 'react'
import type { CreatedKey } from '../types'
import { useCreateKey } from '../useKeys'

type Props = {
	open: boolean
	projectId: string
	onClose: () => void
	onCreated: (key: CreatedKey) => void
}

export function CreateKeyModal({ open, projectId, onClose, onCreated }: Props) {
	const [name, setName] = useState('')
	const createKey = useCreateKey()

	if (!open) return null

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()

		const result = await createKey.mutateAsync({
			projectId,
			name,
		})

		setName('')
		onClose()
		onCreated(result as CreatedKey)
	}

	return (
		<>
			<button className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

			<div
				className="
        fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
        w-full max-w-md z-50
        bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6
      "
			>
				<div className="flex items-center justify-between mb-5">
					<h2 className="text-gray-100 font-semibold text-base">Create API key</h2>
					<button
						onClick={onClose}
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

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-1.5">
						<label className="block text-sm font-medium text-gray-300">Key name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Production, Staging, Development..."
							required
							className="
                w-full px-3 py-2 rounded-md text-sm
                bg-gray-800 border border-gray-700
                text-gray-100 placeholder:text-gray-500
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                transition-colors
              "
						/>
					</div>

					{createKey.error && (
						<p className="text-sm text-danger-text">Something went wrong, please try again</p>
					)}

					<div className="flex items-center justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={createKey.isPending || !name.trim()}
							className="
                px-4 py-2 rounded-md text-sm font-medium
                bg-indigo-500 hover:bg-indigo-400
                text-white transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
						>
							{createKey.isPending ? 'Creating...' : 'Create key'}
						</button>
					</div>
				</form>
			</div>
		</>
	)
}
