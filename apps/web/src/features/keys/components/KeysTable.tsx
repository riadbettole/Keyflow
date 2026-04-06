import type { ApiKey } from '../types'

type Props = {
	keys: ApiKey[]
	onRevoke: (keyId: string) => void
	isRevoking: boolean
}

export function KeysTable({ keys, onRevoke, isRevoking }: Props) {
	return (
		<div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
			<table className="w-full">
				<thead>
					<tr className="border-b border-gray-800">
						<th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Name</th>
						<th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Key</th>
						<th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Created</th>
						<th className="px-4 py-3" />
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-800">
					{keys.map((key) => (
						<tr key={key.id} className="group hover:bg-gray-800/40 transition-colors">
							<td className="px-4 py-3">
								<span className="text-sm text-gray-200 font-medium">{key.name}</span>
							</td>

							<td className="px-4 py-3">
								<code className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">
									kf_••••••••••••
								</code>
							</td>

							<td className="px-4 py-3">
								<span className="text-sm text-gray-500">
									{new Date(key.createdAt).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
									})}
								</span>
							</td>

							<td className="px-4 py-3 text-right">
								<button
									onClick={() => onRevoke(key.id)}
									disabled={isRevoking}
									className="
                    opacity-0 group-hover:opacity-100
                    text-xs text-gray-500 hover:text-danger-text
                    transition-all disabled:cursor-not-allowed
                  "
								>
									Revoke
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
