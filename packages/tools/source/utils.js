export function noop() { }

export function identity(value) {
  return value
}

export function constant(value) {
  return () => value
}
