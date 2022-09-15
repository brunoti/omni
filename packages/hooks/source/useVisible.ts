import { useState, useMemo } from 'react'

export function useVisible({
	initialState = false,
}: { initialState?: boolean } = {}): {
	visible: boolean
	show: () => void
	hide: () => void
} {
	const [visible, setVisible] = useState(initialState)
	return useMemo(
		() => ({
			visible,
			show: (): void => setVisible(true),
			hide: (): void => setVisible(false),
			toggle: (): void => setVisible(oldState => !oldState),
		}),
		[visible, setVisible],
	)
}
