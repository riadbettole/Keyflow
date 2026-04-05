import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
	const { login, error, loading } = useLogin()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		login({ email, password })
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Error banner */}
			{error && (
				<div className="bg-danger-muted border border-danger rounded-md px-4 py-3">
					<p className="text-danger-text text-sm">
						{error === 'INVALID_CREDENTIALS'
							? 'Invalid email or password'
							: 'Something went wrong, try again'}
					</p>
				</div>
			)}

			{/* Email */}
			<div className="space-y-1.5">
				<label htmlFor="email" className="block text-sm font-medium text-gray-200">
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@company.com"
					required
					className="
            w-full px-3 py-2 rounded-md text-sm
            bg-gray-700
            border border-[hsl(213,20%,28%)]
            text-gray-100
            placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-colors
          "
				/>
			</div>

			{/* Password */}
			<div className="space-y-1.5">
				<label htmlFor="password" className="block text-sm font-medium text-gray-200">
					Password
				</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="••••••••"
					required
					className="
            w-full px-3 py-2 rounded-md text-sm
            bg-gray-700
            border border-[hsl(213,20%,28%)]
            text-gray-100
            placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-colors
          "
				/>
			</div>

			{/* Submit */}
			<button
				type="submit"
				disabled={loading}
				className="
          w-full py-2 px-4 rounded-md text-sm font-medium
          bg-indigo-500 hover:bg-indigo-400
          text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors mt-2
        "
			>
				{loading ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
	)
}
