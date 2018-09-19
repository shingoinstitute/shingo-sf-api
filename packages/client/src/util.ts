import { PromisifyAll } from './promisify-fix'
import { promisify } from 'util'
import { sfservices as M, toClass } from '@shingo/sf-api-shared'
import { ServiceError } from 'grpc'
// tslint:disable-next-line:no-implicit-dependencies
import { ErrorResult, SuccessResult, RecordResult } from 'jsforce'

/**
 * Binds all methods on an object using Proxy
 * from https://ponyfoo.com/articles/binding-methods-to-class-instance-objects
 * @param obj The object
 */
export const bindAll = <T extends object>(obj: T): T => {
  const cache = new WeakMap()
  const handler: ProxyHandler<T> = {
    get(target, key) {
      const value = Reflect.get(target, key)
      if (typeof value !== 'function') {
        return value
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target))
      }

      return cache.get(value)
    },
  }
  return new Proxy(obj, handler)
}

export const mapUndefined = <A, B>(f: (v: A) => B) => (
  v: A | undefined,
): B | undefined => (typeof v !== 'undefined' ? f(v) : v)

export const unjsonify = (o: M.JSONObject) =>
  typeof o.contents !== 'undefined'
    ? (JSON.parse(o.contents) as object)
    : o.contents

export const promisifyAll = <T extends object>(obj: T): PromisifyAll<T> => {
  const cache = new WeakMap()
  const handler: ProxyHandler<T> = {
    get(target, key) {
      const value = Reflect.get(target, key)
      if (typeof value !== 'function') {
        return value
      }
      if (!cache.has(value)) {
        cache.set(value, promisify(value))
      }
      return cache.get(value)
    },
  }

  return new Proxy(obj, handler) as any
}

const flatten = <T>(arr: T[][]) => arr.reduce((p, c) => [...p, ...c], [])

export const parseError = (err: ServiceError) => {
  const errorMeta = err.metadata && err.metadata.get('error-bin')
  const parsedErrorMeta =
    errorMeta && errorMeta.map(e => JSON.parse(e.toString()))

  if (parsedErrorMeta && parsedErrorMeta.length > 0) {
    throw toClass(Error)(parsedErrorMeta[0])
  }

  throw err
}

export class SalesforceMutateError extends Error {
  name = 'SalesforceMutateError'
  errors: Array<
    string | { statusCode?: string; message?: string; fields?: string[] }
  >
  success: string[]
  constructor(
    errors: ErrorResult[],
    success: SuccessResult[],
    message?: string,
  ) {
    super(message)
    this.errors = flatten(errors.map(e => e.errors))
    this.success = success.map(s => s.id)
  }
}

export const handleRecordResults = (message?: string) => (
  rs: RecordResult[],
): SuccessResult[] => {
  const fails = rs.filter((r): r is ErrorResult => !r.success)
  const success = rs.filter((r): r is SuccessResult => r.success)

  if (fails.length > 0) {
    throw new SalesforceMutateError(fails, success, message)
  }

  return rs as SuccessResult[]
}
