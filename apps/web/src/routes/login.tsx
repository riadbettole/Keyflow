import { createFileRoute, Link } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { requireGuest } from '@/shared/lib/auth-guard'

export const Route = createFileRoute('/login')({
	beforeLoad: () => requireGuest(),
	component: LoginPage,
})

function LoginPage() {
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
					<h1 className="text-gray-100 text-2xl font-semibold">Welcome back</h1>
					<p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
				</div>

				<div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg">
					<LoginForm />
				</div>

				<p className="text-center text-sm text-gray-400 mt-6">
					Don't have an account?{' '}
					<Link
						to="/register"
						className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	)
}
