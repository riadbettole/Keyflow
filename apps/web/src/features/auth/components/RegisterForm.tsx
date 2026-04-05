import { useState } from 'react'
import { useRegister } from '../hooks/useRegister'

export function RegisterForm() {
	const { register, error, loading } = useRegister()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault()
		register({ name, email, password })
	}

	const inputClass = `
    w-full px-3 py-2 rounded-md text-sm
    bg-[hsl(213,20%,22%)]
    border border-[hsl(213,20%,28%)]
    text-[hsl(210,20%,93%)]
    placeholder:text-[hsl(210,14%,45%)]
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    transition-colors
  `

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{error && (
				<div className="bg-danger-muted border border-danger rounded-md px-4 py-3">
					<p className="text-danger-text text-sm">Something went wrong, please try again</p>
				</div>
			)}

			<div className="space-y-1.5">
				<label htmlFor="name" className="block text-sm font-medium text-gray-200">
					Name
				</label>
				<input
					id="name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Ada Lovelace"
					required
					className={inputClass}
				/>
			</div>

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
					className={inputClass}
				/>
			</div>

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
					minLength={8}
					className={inputClass}
				/>
			</div>

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
				{loading ? 'Creating account...' : 'Create account'}
			</button>
		</form>
	)
}
