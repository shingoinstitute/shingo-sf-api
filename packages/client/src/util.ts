import { PromisifyAll } from './promisify-fix'
import { promisify } from 'util'
import { sfservices as M } from '@shingo/sf-api-shared'

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
