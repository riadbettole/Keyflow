import type { AppError } from './result'

export type Result<S, E extends { reason: string }> =
	| { ok: true; data: S }
	| { ok: false; error: E }

export function ok<S>(data: S): Result<S, never> {
	return { ok: true, data }
}

export function err<E extends { reason: string }>(error: E): Result<never, E> {
	return { ok: false, error }
}

export class AppErrorException extends Error {
	constructor(public readonly error: AppError) {
		super(error.reason)
		this.name = 'AppErrorException'
	}

	get reason() {
		return this.error.reason
	}
}

export function throwError(error: AppError): never {
	throw new AppErrorException(error)
}
