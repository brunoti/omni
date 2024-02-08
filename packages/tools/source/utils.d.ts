export function noop(): void
export function identity<ValueType>(value: ValueType): ValueType
export function constant<ValueType>(value: ValueType): () => ValueType
