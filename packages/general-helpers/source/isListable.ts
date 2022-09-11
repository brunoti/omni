import { len } from './len'

export const isListable = <T>(maybeList: T): maybeList is NonNullable<T> => {
	return len(maybeList) > 0
}
