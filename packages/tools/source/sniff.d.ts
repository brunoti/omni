type Sniff = (<T>(value: T) => T) & {
	tag: (tag: string) => <T>(value: T) => T
}

export const sniff: Sniff
