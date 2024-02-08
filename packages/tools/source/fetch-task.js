import { pipe } from '@excelsia/pipe'
import * as T from './task.js'
import * as TR from './task-result.js'

export class HttpError extends Error {
  constructor(response, request) {
    const code = response.status || response.status === 0 ? response.status : ''
    const title = response.statusText || ''
    const status = `${code} ${title}`.trim()
    const reason = status ? `status code ${status}` : 'an unknown error'

    super(`Request failed with ${reason}`)

    this.name = 'HTTPError'
    this.response = response
    this.request = request
    this.options = options
  }

  json() {
    return this.response.json()
  }
}

export function toJson(task) {
  return TR.map(task, response => response.json())
}

export function failWhenNotOk(...args) {
  if (args.length === 1) {
    return task => failWhenNotOk(task, args[0])
  }

  return TR.map(task, response => {
    if (response.ok) {
      return response
    }
    throw new HttpError(response, request)
  })
}

export function of(request) {
  return pipe(
    TR.create(() => fetch(request)),
    failWhenNotOk(request),
  )
}

export async function toTask(task) {
  return T.of(() => pipe(task(), andThen(R.unwrap)))
}
