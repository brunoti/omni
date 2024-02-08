import { pipe } from '@excelsia/pipe'
import { P, match } from 'ts-pattern'
import { expect, describe, test, vi } from 'vitest'
import * as R from './result'
import { tokens } from './tokens'

describe('success()', () => {
  test('given 1: should return a Result.Success(1)', () => {
    const result = R.success(1)
    expect(result.toString).toBeInstanceOf(Function)
    expect(result[tokens.success]).toBe(1)
    expect(result.toString()).toBe('Result.Success(1)')
  })
})

describe('failure()', () => {
  test('given "error": should return a Result.Failure("error")', () => {
    const result = R.failure('error')
    expect(result.toString).toBeInstanceOf(Function)
    expect(result[tokens.failure]).toBe('error')
    expect(result.toString()).toBe('Result.Failure(error)')
  })

  test('given an Error("error"): should return a Result.Failure("error")', () => {
    const error = new Error('error')
    const result = R.failure(error)
    expect(result.toString).toBeInstanceOf(Function)
    expect(result[tokens.failure]).toBe(error)
    expect(result.toString()).toBe(`Result.Failure(${error.message})`)
  })
})

describe('isResult()', () => {
  test('given Result.Success("error"): should return true', () => {
    expect(R.isResult(R.success('error'))).toBe(true)
  })
  test('given Result.Failure("error"): should return true', () => {
    expect(R.isResult(R.failure('error'))).toBe(true)
  })
  test('given Result.Success(1): should return true', () => {
    expect(R.isResult(R.success(1))).toBe(true)
  })
  test('given normal values: should return false', () => {
    // @ts-expect-error
    expect(R.isResult({})).toBe(false)
  })
})
describe('isSuccess()', () => {
  test('given Result.Success("error"): should return true', () => {
    expect(R.isSuccess(R.success('error'))).toBe(true)
  })
  test('given Result.Failure("error"): should return false', () => {
    expect(R.isSuccess(R.failure('error'))).toBe(false)
  })
  test('given Result.Success(1): should return true', () => {
    expect(R.isSuccess(R.success(1))).toBe(true)
  })
  test('given normal values: should return false', () => {
    // @ts-expect-error
    expect(R.isSuccess({})).toBe(false)
  })
})
describe('isFailure()', () => {
  test('given Result.Failure("error"): should return true', () => {
    expect(R.isFailure(R.failure('error'))).toBe(true)
  })
  test('given Result.Success("error"): should return false', () => {
    expect(R.isFailure(R.success('error'))).toBe(false)
  })
  test('given Result.Success(1): should return false', () => {
    expect(R.isFailure(R.success(1))).toBe(false)
  })
  test('given normal values: should return false', () => {
    // @ts-expect-error
    expect(R.isFailure({})).toBe(false)
  })
})

describe('map()', () => {
  test('given a success and a mapper: should return a new result with the mapped value', () => {
    const value = R.success(1)
    const result = R.map(value, value => value + 1)
    expect(result === value).toBe(false)
    expect(result[tokens.success]).toBe(2)
    expect(result.toString()).toBe('Result.Success(2)')
  })
  test('given a failure and a mapper: should return the result unchanged', () => {
    const value = R.failure(1)
    const result = R.map(value, value => value + 1)
    expect(result === value).toBe(true)
    expect(result[tokens.failure]).toBe(1)
    expect(result.toString()).toBe('Result.Failure(1)')
  })
  test('given only a mapper: should return a function that takes a result', () => {
    const mapper = vi.fn(value => value + 1)
    const inc = vi.fn(R.map(mapper))
    const success = inc(R.success(1))
    const failure = inc(R.failure(1))
    expect(mapper).toHaveBeenCalledTimes(1)
    expect(inc).toHaveBeenCalledTimes(2)
    expect(mapper).toBeInstanceOf(Function)
    expect(success[tokens.success]).toBe(2)
    expect(failure[tokens.failure]).toBe(1)
  })
})

describe('flatMap()', () => {
  test('given an success and a mapper: should return a new result with the mapped value', () => {
    const value = R.success(1)
    const result = R.flatMap(value, value => R.success(value + 1))
    expect(result === value).toBe(false)
    expect(result[tokens.success]).toBe(2)
    expect(result.toString()).toBe('Result.Success(2)')
  })
  test('given a failure and a mapper: should return the result unchanged', () => {
    const value = R.failure(1)
    const result = R.flatMap(value, value => R.success(value + 1))
    expect(result === value).toBe(true)
    expect(result[tokens.failure]).toBe(1)
    expect(result.toString()).toBe('Result.Failure(1)')
  })
  test('given only a mapper: should return a function that takes a result', () => {
    const mapper = vi.fn(value => R.success(value + 1))
    const inc = vi.fn(R.flatMap(mapper))
    const success = inc(R.success(1))
    const failure = inc(R.failure(1))
    expect(inc.name).toBe('flatMap.curry')
    expect(mapper).toHaveBeenCalledTimes(1)
    expect(inc).toHaveBeenCalledTimes(2)
    expect(mapper).toBeInstanceOf(Function)
    expect(success[tokens.success]).toBe(2)
    expect(failure[tokens.failure]).toBe(1)
  })
})

describe('execute()', () => {
  test('given a function: should return a Result.Success(1)', () => {
    const result = R.execute(() => 1)
    expect(result[tokens.success]).toBe(1)
    expect(result.toString()).toBe('Result.Success(1)')
  })
  test('given an Error("error"): should return a Result.Failure("error")', () => {
    const error = new Error('error')
    const result = R.execute(() => {
      throw error
    })
    expect(result[tokens.failure]).toBe(error)
    expect(result.toString()).toBe(`Result.Failure(${error.message})`)
  })
})

describe('unwrap()', () => {
  test('given Result.Success(1): should return 1', () => {
    const result = R.success(1)
    expect(R.unwrap(result)).toBe(1)
  })
  test('given Result.Failure(new Error("error")): should return the error', () => {
    const error = new Error('error')
    const result = R.failure(error)
    expect(R.unwrap(result)).toBe(error)
  })
})

describe('unwrapUnsafe()', () => {
  test('given Result.Success(1): should return 1', () => {
    const result = R.success(1)
    expect(R.unwrapUnsafe(result)).toBe(1)
  })
  test('given Result.Failure(new Error("error")): should throw', () => {
    const error = new Error('error')
    const result = R.failure(error)
    expect(() => R.unwrapUnsafe(result)).toThrow(error)
  })
})

describe('mapFailure()', () => {
  test('given a failure and a function that returns 1: should return a Result.Failure(1)', () => {
    const result = R.mapFailure(R.failure(2), () => 1)
    expect(result[tokens.failure]).toBe(1)
    expect(result.toString()).toBe('Result.Failure(1)')
  })
  test('given an success and a function that returns 1: should return a mapFailure that returns 1', () => {
    const result = R.mapFailure(R.success(2), () => 1)
    expect(result[tokens.success]).toBe(2)
    expect(result.toString()).toBe('Result.Success(2)')
  })
  test('given function that returns 1: should return a mapFailure that returns 1', () => {
    const error = new Error('error')
    const defaultFailureToOne = R.mapFailure<Error, number, number>(() => 1)
    // TODO: this should failure
    // const failure = defaultFailureToOne(R.failure(2))
    const failure = defaultFailureToOne(R.failure(error))
    expect(failure[tokens.failure]).toBe(1)
    expect(failure.toString()).toBe('Result.Failure(1)')
  })
})

describe('onFailure()', () => {
  test('given a failure and a function that returns 1: should return a Result.Success(1)', () => {
    const result = R.onFailure(R.failure(2), () => 1)
    expect(result[tokens.success]).toBe(1)
    expect(result.toString()).toBe('Result.Success(1)')
  })
  test('given an success and a function that returns 1: should return a onFailure that returns 1', () => {
    const result = R.onFailure(R.success(2), () => 1)
    expect(result[tokens.success]).toBe(2)
    expect(result.toString()).toBe('Result.Success(2)')
  })
  test('given function that returns 1: should return a onFailure that returns 1', () => {
    const defaultFailureToOne = R.onFailure(() => 1)
    const result = defaultFailureToOne(R.failure(2))
    expect(result[tokens.success]).toBe(1)
    expect(result.toString()).toBe('Result.Success(1)')
  })
})

describe('match()', () => {
  test('given success(1), onFailure(() => 1), onSuccess(() => 2): should return 2', () => {
    const result = R.match(R.success(1), {
      onFailure: () => 1,
      onSuccess: () => 2
    })
    expect(result).toBe(2)
  })
  test('given failure(1), onFailure(() => 1), onSuccess(() => 2): should return 1', () => {
    const result = R.match(R.failure(1), {
      onFailure: () => 1,
      onSuccess: () => 2
    })
    expect(result).toBe(1)
  })
  test('given onFailure(() => 1), onSuccess(() => 2): should return a function that handles result', () => {
    const result = R.match({
      onFailure: () => 1,
      onSuccess: () => 2
    })
    expect(result(R.failure(1))).toBe(1)
    expect(result(R.success(2))).toBe(2)
  })
})

describe('unwrapWithDefault()', () => {
  test('given success(1): should return 1', () => {
    const result = R.unwrapWithDefault(R.success(1), 2)
    expect(result).toBe(1)
  })
  test('given failure(1): should return 2', () => {
    const result = R.unwrapWithDefault(R.failure(1), 2)
    expect(result).toBe(2)
  })
  test('given a value: should return a function that unwraps the result', () => {
    const result = R.unwrapWithDefault(1)
    expect(result).toBeInstanceOf(Function)
    expect(result(R.success(1))).toBe(1)
    expect(result(R.failure(2))).toBe(1)
  })
})

describe('mapWithDefault()', () => {
  test('given success(1), () => 1, 2: should return 1', () => {
    const result = R.mapWithDefault(R.success(1), () => 1, 2)
    expect(result).toBe(1)
  })
  test('given failure(1), () => 1, 2: should return 2', () => {
    const result = R.mapWithDefault(R.failure(1), () => 1, 2)
    expect(result).toBe(2)
  })
  test('given () => 1, 2: should a return a mapper', () => {
    const mapper = R.mapWithDefault(() => 1, 2)
    expect(mapper).toBeInstanceOf(Function)
    expect(mapper.name).toBe('mapWithDefault.curry')
    expect(mapper(R.success(''))).toBe(1)
    expect(mapper(R.failure(''))).toBe(2)
  })
})

describe('recover()', () => {
  test('given an Success a value: should return the Success', () => {
    const success = R.success(1)
    const result = R.recover(success, 2)
    expect(result[tokens.success]).toBe(1)
    expect(result === success).toBe(true)
  })
  test('given a Failure a value: should return the value', () => {
    const result = R.recover(R.failure(1), 2)
    expect(result[tokens.success]).toBe(2)
  })
  test('given a recover value: should return a function to recover', () => {
    const success = R.success(1)
    const failure = R.failure(1)
    const recover = R.recover(2)
    expect(recover).toBeInstanceOf(Function)
    expect(recover.name).toBe('recover.curry')
    expect(recover(success)).toBe(success)
    expect(recover(failure).toString()).toBe('Result.Success(2)')
  })
})

describe('tap()', () => {
  test('given a result and a function: should always return the same result', () => {
    const success = R.success(1)
    const failure = R.failure(1)
    expect(R.tap(success, () => { }) === success).toBe(true)
    expect(R.tap(failure, () => { }) === failure).toBe(true)
  })
  test('given a result and a function: should call the function only on success', () => {
    const fn = vi.fn()
    const success = R.success(1)
    const failure = R.failure(1)
    R.tap(success, fn)
    R.tap(failure, fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })
  test('given a function: should return the tapping function', () => {
    const fn = vi.fn()
    const success = R.success(1)
    const failure = R.failure(1)
    const tap = R.tap(fn)
    expect(tap).toBeInstanceOf(Function)
    expect(tap.name).toBe('tap.curry')

    expect(tap(failure)).toBe(failure)
    expect(fn).toHaveBeenCalledTimes(0)

    expect(tap(success)).toBe(success)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('tapFailure()', () => {
  test('given a result and a function: should always return the same result', () => {
    const success = R.success(1)
    const failure = R.failure(1)
    expect(R.tapFailure(success, () => { }) === success).toBe(true)
    expect(R.tapFailure(failure, () => { }) === failure).toBe(true)
  })
  test('given a result and a function: should call the function only on success', () => {
    const fn = vi.fn()
    const success = R.success(1)
    const failure = R.failure(1)
    R.tapFailure(success, fn)
    expect(fn).toHaveBeenCalledTimes(0)
    R.tapFailure(failure, fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })
  test('given a function: should return the tapping function', () => {
    const fn = vi.fn()
    const success = R.success(1)
    const failure = R.failure(1)
    const tapFailure = R.tapFailure(fn)

    expect(tapFailure).toBeInstanceOf(Function)
    expect(tapFailure.name).toBe('tapFailure.curry')

    expect(tapFailure(success)).toBe(success)
    expect(fn).toHaveBeenCalledTimes(0)

    expect(tapFailure(failure)).toBe(failure)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('toNullable()', () => {
  test('given an Success: should return the value', () => {
    const success = R.success(1)
    expect(R.toNullable(success)).toBe(1)
  })
  test('given a Failure: should return null', () => {
    const failure = R.failure(1)
    expect(R.toNullable(failure)).toBe(null)
  })
})

describe('toUndefined()', () => {
  test('given an Success: should return the value', () => {
    const success = R.success(1)
    expect(R.toUndefined(success)).toBe(1)
  })
  test('given a Failure: should return undefined', () => {
    const failure = R.failure(1)
    expect(R.toUndefined(failure)).toBe(undefined)
  })
})

describe('filter()', () => {
  test('given an Success: should return the value', () => {
    const success = R.success(1)
    expect(R.filter(success, value => value > 0, null)).toBe(success)
  })
  test('given a Failure: should return the value', () => {
    const failure = R.failure(1)
    expect(R.filter(failure, value => value > 0, null)).toBe(failure)
  })
  test('given a predicate and a value: should return a new result', () => {
    const success = R.success(1)

    expect(
      pipe(
        success,
        R.filter(value => value > 0, null),
      )
    ).toBe(success)

    expect(
      pipe(
        success,
        R.filter(value => value < 0, null),
      )
    ).toMatchObject({
      [tokens.failure]: null
    })

    expect(
      pipe(
        R.failure(1),
        R.filter(value => value > 0, null),
      )
    ).toMatchObject({
      [tokens.failure]: 1
    })
  })
})

describe('can be used with ts-pattern', () => {
  test('given an match(Result): should work with exhaustive', () => {
    const whatsThis = (value: R.Result<Error, any>) => match<R.Result<Error, any>>(value)
      .with(R.success(P.select()), () => 'Success')
      .with(R.failure(P.select()), () => 'Failure')
      .exhaustive()

    expect(whatsThis(R.execute(() => { throw Error('error') }))).toBe('Failure')
    expect(whatsThis(R.execute(() => 1))).toBe('Success')
  })
})
