export function andThen<T>(
	promise: Promise<T>,
	fn: (value: T) => Promise<T>,
): Promise<T>
export function andThen<T>(fn: (value: T) => T): (value: T) => Promise<T>

export function andCatch<T, E = Error>(
	promise: Promise<T>,
	fn: (error: E) => Promise<T>,
): Promise<T>
export function andCatch<T>(fn: (error: unknown) => T): (value: T) => Promise<T>
