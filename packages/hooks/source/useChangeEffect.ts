import {useEffect, useRef} from "react"

export function useChangeEffect(effect: () => void, deps: unknown[]): void {
	const isFirst = useRef(true)

	useEffect(() => {
		if (isFirst.current) {
			isFirst.current = false
			return
		}

		effect()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deps])
}

