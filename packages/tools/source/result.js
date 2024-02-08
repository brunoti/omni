import { tokens as keys } from './tokens.js'

const createNamedFn = (name, fn) => {
	Object.defineProperty(fn, 'name', { value: name })
	return fn
}

export const Success = {
	__TAG__: 'Result.Success',
}
export const Failure = {
	__TAG__: 'Result.Failure',
}

/** @type {import('./result').success} */
export function success(value) {
	const result = {
		[keys.success]: value,
		...Success,
	}

	result.__proto__.toString = function () {
		return `Result.Success(${this[keys.success]})`
	}

	return result
}

/** @type {import('./result').failure} */
export function failure(error) {
	const result = {
		[keys.failure]: error,
		...Failure,
	}

	result.__proto__.toString = function () {
		return `Result.Failure(${this[keys.failure].message ? `${this[keys.failure].message}` : this[keys.failure]})`
	}

	return result
}

/** @type {import('./result').isResult} */
export function isResult(value) {
	return (
		Object.prototype.hasOwnProperty.call(value, keys.success) ||
		Object.prototype.hasOwnProperty.call(value, keys.failure)
	)
}

/** @type {import('./result').isSuccess} */
export function isSuccess(result) {
	return Object.prototype.hasOwnProperty.call(result, keys.success)
}

/** @type {import('./result').isFailure} */
export function isFailure(result) {
	return Object.prototype.hasOwnProperty.call(result, keys.failure)
}

/** @type {import('./result').unwrap} */
export function unwrap(result) {
	if (isSuccess(result)) {
		return result[keys.success]
	}
	return result[keys.failure]
}

/** @type {import('./result').unwrapUnsafe} */
export function unwrapUnsafe(result) {
	if (isSuccess(result)) {
		return result[keys.success]
	}
	throw result[keys.failure]
}

/** @type {import('./result').unwrapWithDefault} */
export function unwrapWithDefault(...args) {
	if (args.length === 1) {
		return createNamedFn('unwrapWithDefault.curry', result =>
			unwrapWithDefault(result, args[0]),
		)
	}

	const [result, fallback] = args

	return isSuccess(result) ? result[keys.success] : fallback
}

/** @type {import('./result').map} */
export function map(...args) {
	if (args.length === 1) {
		const mapper = args[0]
		return createNamedFn('map.curry', result => map(result, mapper))
	}

	const [result, mapper] = args
	createNamedFn(mapper.name || 'map.mapper', mapper)
	return isSuccess(result) ? success(mapper(result[keys.success])) : result
}

/** @type {import('./result').flatMap} */
export function flatMap(...args) {
	if (args.length === 1) {
		return createNamedFn('flatMap.curry', result => flatMap(result, args[0]))
	}

	const [result, mapper] = args
	createNamedFn(mapper.name || 'flatMap.mapper', mapper)

	if (isSuccess(result)) {
		const mapped = mapper(result[keys.success])
		return mapped
	}

	return result
}

/** @type {import('./result').execute} */
export function execute(fn) {
	try {
		return success(fn())
	} catch (error) {
		return failure(error)
	}
}

export function mapFailure(...args) {
	if (args.length === 1) {
		const mapper = args[0]
		return result => mapFailure(result, mapper)
	}

	const [result, mapper] = args

	if (isFailure(result)) {
		return failure(mapper(result[keys.failure]))
	}

	return result
}

export function onFailure(...args) {
	if (args.length === 1) {
		const handler = args[0]
		return result => onFailure(result, handler)
	}

	const [result, handler] = args

	if (isFailure(result)) {
		return success(handler(result[keys.failure]))
	}

	return result
}

export function match(...args) {
	if (args.length === 1) {
		const handlers = args[0]
		return createNamedFn('match.curry', result => match(result, handlers))
	}

	const [result, handlers] = args

	if (isSuccess(result)) {
		return handlers.onSuccess(result[keys.success])
	}

	return handlers.onFailure(result[keys.failure])
}

/** @type {import('./result').mapWithDefault} */
export function mapWithDefault(...args) {
	if (args.length === 2) {
		const [mapper, defaultValue] = args
		return createNamedFn('mapWithDefault.curry', result =>
			mapWithDefault(result, mapper, defaultValue),
		)
	}

	const [result, mapper, defaultValue] = args
	createNamedFn(mapper.name || 'map.mapper', mapper)
	return isSuccess(result) ? mapper(result[keys.success]) : defaultValue
}

/** @type {import('./result').recover} */
export function recover(...args) {
	if (args.length === 1) {
		const value = args[0]
		return createNamedFn('recover.curry', result => recover(result, value))
	}

	const [result, value] = args
	return isSuccess(result) ? result : success(value)
}

/** @type {import('./result').tap} */
export function tap(...args) {
	if (args.length === 1) {
		const fn = args[0]
		return createNamedFn('tap.curry', result => tap(result, fn))
	}

	const [result, fn] = args

	if (isSuccess(result)) {
		fn(result[keys.success])
	}

	return result
}

export function tapFailure(...args) {
	if (args.length === 1) {
		const fn = args[0]
		return createNamedFn('tapFailure.curry', result => tapFailure(result, fn))
	}

	const [result, fn] = args

	if (isFailure(result)) {
		fn(result[keys.failure])
	}

	return result
}

export function toNullable(result) {
	return isSuccess(result) ? result[keys.success] : null
}

export function toUndefined(result) {
	return isSuccess(result) ? result[keys.success] : undefined
}

export function filter(...args) {
	if (args.length === 2) {
		const [predicate, failValue] = args
		return createNamedFn('filter.curry', result =>
			filter(result, predicate, failValue),
		)
	}

	const [result, predicate, failValue] = args

	if (isSuccess(result)) {
		return predicate(result[keys.success]) ? result : failure(failValue)
	}

	return result
}

export function mapBoth(...args) {
	if (args.length === 2) {
		return result => mapBoth(result, args[0], args[1])
	}

	const [result, failureMapper, successMapper] = args

	if (isSuccess(result)) {
		return success(successMapper(result[keys.success]))
	}

	return failure(failureMapper(result[keys.failure]))
}

export function tapBoth(...args) {
	if (args.length === 2) {
		return result => tapBoth(result, args[0], args[1])
	}

	const [result, failureTap, successTap] = args

	if (isSuccess(result)) {
		return tap(result, successTap)
	}

	return tapFailure(result, failureTap)
}
