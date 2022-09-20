import { isPresent } from './isPresent'

function safeMap<T, U extends any>(
	callback: (value: T) => U | undefined | null,
	value: T | undefined | null,
): U | undefined | null

function safeMap<T, U extends any>(
	callback: (value: T) => U | undefined | null,
): (value: T | undefined | null) => U | undefined | null

function safeMap<T, U extends any>(
	callback: (value: T) => U | undefined | null,
	value?: T | undefined | null,
):
	| U
	| ((value: T | null | undefined) => U | null | undefined)
	| null
	| undefined {
	if (!isPresent(value) && arguments.length === 1) {
		return (value: T | undefined | null): U | undefined | null => {
			return isPresent(value) ? callback(value) : undefined
		}
	}

	return isPresent(value) ? callback(value) : undefined
}

function safeFold<T, U>(
	ifNotPresent: () => U | undefined | null,
): (
	ifPresent: (value: T) => U,
) => (value: T | undefined | null) => U | undefined | null

function safeFold<T, U>(
	ifNotPresent: () => U | undefined | null,
	ifPresent: (value: T) => U,
): (value: T | undefined | null) => U | undefined | null

function safeFold<T, U>(
	ifNotPresent: () => U | undefined | null,
	ifPresent: (value: T) => U,
	value: T | undefined | null,
): U | undefined | null

function safeFold<T, U>(
	ifNotPresent: () => U | undefined | null,
	ifPresent?: (value: T) => U,
	value?: T | undefined | null,
) {
	if (arguments.length === 1 && !isPresent(value) && !isPresent(ifPresent)) {
		return (ifPresent: (value: T) => U) => safeFold(ifNotPresent, ifPresent)
	}

	if (arguments.length === 2 && !isPresent(value) && isPresent(ifPresent)) {
		return (value: T) => safeFold(ifNotPresent, ifPresent, value)
	}

	return isPresent(value) ? ifPresent!(value) : ifNotPresent()
}

export const safe = {
	map: safeMap,
	fold: safeFold,
}
