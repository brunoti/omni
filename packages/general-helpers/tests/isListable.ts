import test from 'ava'
import { isListable } from '../source/isListable'

test('isListable() should return true if is listable)', t => {
	t.is(isListable('foo'), true)
	t.is(isListable([1]), true)
})

test('isListable() should return false if is not listable)', t => {
	t.is(isListable(''), false)
	t.is(isListable([]), false)
	t.is(isListable(null), false)
	t.is(isListable(undefined), false)
	t.is(isListable({}), false)
})
