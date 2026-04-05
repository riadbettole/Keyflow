import { createFileRoute, Link } from '@tanstack/react-router'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { requireGuest } from '@/shared/lib/auth-guard'

export const Route = createFileRoute('/register')({
	beforeLoad: () => requireGuest(),
	component: RegisterPage,
})

function RegisterPage() {
	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
			<div className="w-full max-w-sm">
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-2 mb-6">
						<div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
							<span className="text-white font-bold text-sm">K</span>
						</div>
						<span className="text-gray-100 font-semibold text-lg">Keyflow</span>
					</div>
					<h1 className="text-gray-100 text-2xl font-semibold">Create an account</h1>
					<p className="text-gray-400 text-sm mt-1">Start managing your API keys</p>
				</div>

				<div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
					<RegisterForm />
				</div>

				<p className="text-center text-sm text-gray-400 mt-6">
					Already have an account?{' '}
					<Link
						to="/login"
						className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
					>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	)
}
