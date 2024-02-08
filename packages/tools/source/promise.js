export function andThen(...args) {
	if (args.length === 1) {
		return promise => andThen(promise, args[0])
	}

	const [promise, fn] = args

	return promise.then(fn)
}

export function andCatch(...args) {
	if (args.length === 1) {
		return promise => andCatch(promise, args[0])
	}

	const [promise, fn] = args

	return promise.catch(fn)
}
