export function first<T extends HTMLElement>(
	selector: string,
): (node: HTMLElement) => T | null
export function first<T extends HTMLElement>(
	selector: string,
	node: HTMLElement,
): T | null

export function first<T extends HTMLElement>(
	selector: string,
	node?: HTMLElement,
) {
	if (!node) {
		return (_node: HTMLElement) => _node.querySelector(selector) as T | null
	}

	return node.querySelector(selector) as T | null
}
