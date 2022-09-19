export function all<T extends HTMLElement>(
	selector: string,
): (node: HTMLElement) => T | null
export function all<T extends HTMLElement>(
	selector: string,
	node: HTMLElement,
): T | null

export function all<T extends HTMLElement>(
	selector: string,
	node?: HTMLElement,
) {
	if (!node) {
		return (_node: HTMLElement) =>
			Array.from(_node.querySelectorAll(selector)) as T[]
	}

	return Array.from(node.querySelectorAll(selector)) as T[]
}
