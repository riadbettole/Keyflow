export type LoginInput = {
	email: string
	password: string
}

export type RegisterInput = {
	name: string
	email: string
	password: string
}

export type AuthError = 'INVALID_CREDENTIALS' | 'EMAIL_NOT_FOUND' | 'UNEXPECTED'
