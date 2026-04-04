import { create } from 'zustand'

type User = {
	id: string
	name: string
	email: string
	role: string
}

type AuthStore = {
	user: User | null
	setUser: (user: User | null) => void
	isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	user: null,
	setUser: (user) => set({ user }),
	isAuthenticated: () => get().user !== null,
}))
