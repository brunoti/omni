export class PipeError extends Error {
	constructor(message, { source } = {}) {
		super(message)
		this.name = 'PipeError'

		if (source) {
			this.source = { ...source }
			source.name = this.name
			source.message = message
			this.stack = source.stack
		}

		this.message = message
	}
}

export function pipe(value, ...fns) {
	return fns.reduce((acc, fn, index) => {
		try {
			return fn(acc)
		} catch (error) {
			throw new PipeError(
				`pipe(${fn.name}) at index ${index}: ${error.message}`,
				{
					source: error,
					name: fn.name || 'unknown',
					index,
				},
			)
		}
	}, value)
}
