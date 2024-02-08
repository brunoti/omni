export function sniff(value) {
	console.log(value)
	return value
}

sniff.tag = tag => {
	return value => {
		console.log(tag, value)
		return value
	}
}
