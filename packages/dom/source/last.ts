export function last<T extends HTMLElement>(
	selector: string,
): (node: HTMLElement) => T | null
export function last<T extends HTMLElement>(
	selector: string,
	node: HTMLElement,
): T | null

export function last<T extends HTMLElement>(
	selector: string,
	node?: HTMLElement,
) {
	if (!node) {
		return (_node: HTMLElement) =>
			Array.from(_node.querySelectorAll(selector)).at(-1) as T | null
	}

	return Array.from(node.querySelectorAll(selector)).at(-1) as T | null
}
