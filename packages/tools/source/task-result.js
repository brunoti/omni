import { pipe } from '@excelsia/pipe'
import * as R from './result.js'
import { andThen } from './promise.js'

/** @type {import('./task-result').create} */
export function create(fn) {
  return async () => {
    try {
      const value = await fn()
      return R.success(value)
    } catch (error) {
      return R.failure(error)
    }
  }
}

/** @type {import('./task-result').map} */
export function map(...args) {
  if (args.length === 1) {
    return task => map(task, args[0])
  }

  const [task, mapper] = args

  return create(() =>
    pipe(task(), andThen(R.map(mapper)), andThen(R.unwrapUnsafe)),
  )
}

export function mapFailure(...args) {
  if (args.length === 1) {
    return task => mapFailure(task, args[0])
  }

  const [task, mapper] = args

  return create(() =>
    pipe(task(), andThen(R.mapFailure(mapper)), andThen(R.unwrapUnsafe)),
  )
}

export function mapBoth(...args) {
  if (args.length === 2) {
    return task => mapBoth(task, args[0], args[1])
  }

  const [task, failureMapper, successMapper] = args

  return create(() =>
    pipe(
      task(),
      andThen(R.mapBoth(failureMapper, successMapper)),
      andThen(R.unwrapUnsafe),
    ),
  )
}

export function tap(...args) {
  if (args.length === 1) {
    return task => tap(task, args[0])
  }

  const [task, fn] = args

  return create(() => pipe(task(), andThen(R.tap(fn)), andThen(R.unwrapUnsafe)))
}

export function tapFailure(...args) {
  if (args.length === 1) {
    return task => tapFailure(task, args[0])
  }

  const [task, fn] = args
  return create(() =>
    pipe(task(), andThen(R.tapFailure(fn)), andThen(R.unwrapUnsafe)),
  )
}

export function flatMap(...args) {
  if (args.length === 1) {
    return task => flatMap(task, args[0])
  }

  const [task, mapper] = args

  return create(() =>
    pipe(
      task(),
      andThen(R.flatMap(mapper)),
      andThen(R.unwrapUnsafe),
      andThen(t => t()),
      andThen(R.unwrapUnsafe),
    ),
  )
}

function delay(...args) {
  if (args.length === 1) {
    return task => delay(task, args[0])
  }

  const [task, ms] = args

  return create(() =>
    pipe(
      task(),
      andThen(async r => {
        await new Promise(resolve => setTimeout(resolve, ms))
        return r
      }),
      andThen(R.unwrapUnsafe),
    ),
  )
}

export function of(value) {
  return create(() => Promise.resolve(value))
}

const myFetch = request =>
  pipe(
    create(() => fetch(request)),
    map(f => f.json()),
  )
const getUrl = () =>
  pipe(of('https://jsonplaceholder.typicode.com/posts/1'), delay(5000))

const task = pipe(getUrl(), flatMap(myFetch))

console.log(await task())
