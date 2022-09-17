import { useState, useMemo } from 'react'

export function useArray<T>(initial: T[]) {
	const [array, setArray] = useState<T[]>(initial)
	return useMemo(
		() => ({
			value: array,
			replace: setArray,
			includes: (item: T) => array.includes(item),
			push: (item: T) => setArray([...array, item]),
			remove: (item: T) => setArray(array.filter(i => i !== item)),
			toggle: (item: T) =>
				array.includes(item)
					? setArray(array.filter(i => i !== item))
					: setArray([...array, item]),
			thunk: {
				push: (item: T) => () => setArray([...array, item]),
				remove: (item: T) => () => setArray(array.filter(i => i !== item)),
				toggle: (item: T) => () =>
					array.includes(item)
						? setArray(array.filter(i => i !== item))
						: setArray([...array, item]),
			},
		}),
		[array],
	)
}
