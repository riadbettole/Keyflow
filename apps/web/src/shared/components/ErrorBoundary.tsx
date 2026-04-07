import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
	state = { hasError: false }

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center py-24">
					<div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-4">
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="text-danger-text"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 8v4M12 16h.01" />
						</svg>
					</div>
					<p className="text-sm text-gray-400 mb-1">Something went wrong</p>
					<button
						onClick={() => this.setState({ hasError: false })}
						className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-2"
					>
						Try again
					</button>
				</div>
			)
		}
		return this.props.children
	}
}
