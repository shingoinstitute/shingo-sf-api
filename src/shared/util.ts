import { Connection } from 'jsforce'
import { ServiceError, status as Status, Metadata, handleUnaryCall } from 'grpc'
import { LoggerInstance } from 'winston'
import { RecordsRequest, JSONObject } from './messages'
import _ from 'lodash'

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

/**
 * Authenticates a connection to salesforce and calls a function with the logged in connection
 * @param username Salesforce username
 * @param password Salesforce password
 * @param connection JSForce connection object
 * @param fn The function to run
 */
export const runQuery =
  (username: string, password: string, connection: Connection) =>
  <T>(fn: ((conn: Connection) => Promise<T>)) =>
    connection.login(username, password)
      .then(() => fn(connection))
      .then(res => { connection.logout(); return res })

export class SError extends Error implements ServiceError {
  code?: Status
  metadata?: Metadata

  constructor(error: Error, status?: Status) {
    super()
    this.message = error.message
    this.name = error.name || 'Error'
    this.metadata = new Metadata()
    this.metadata.add('error-bin', Buffer.from(JSON.stringify(error)))
    this.code = status || Status.INTERNAL
  }
}

/**
 * Handles a GRPC unary request
 * @param logger Logger instance
 * @param name Function name for logging
 * @param fn Handler function implementation
 */
export const handleUnary =
  (logger: LoggerInstance) =>
  <Req, Res>(name: string, fn: (req: Req) => Promise<Res>): handleUnaryCall<Req, Res> =>
  (call, cb) => {
    fn(call.request)
      .then(record => cb(null, record))
      .catch(error => {
        logger.error(`Error in ${name}(): %j`, error)
        cb(new SError(error), null)
      })
  }

export const getRecords = (req: RecordsRequest, omit: string[] = []) =>
  req.records.map(record => _.omit(JSON.parse(record.contents), omit))

/** Packages a response into a JSONObject */
// tslint:disable-next-line:variable-name
export const jsonobject = (x: any): JSONObject => ({ contents: JSON.stringify(x) })

export const unjsonobject = (x: JSONObject) => JSON.parse(x.contents)

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

const removeKey = (o: any) => (key: keyof any) => {
  if (_.isObject(o)) {
    Object.keys(o).forEach(k => {
      if (k === key) {
        delete o[k]
      } else if (_.isObject(o[k])) {
        // for very deep objects this could cause the stack to overflow
        // but this did not occur ever when using the deep-clean library
        removeKey(o[k])(key)
      }
    })
  }
}

export const deepClean = <T extends object, K extends keyof any>(o: T, ...keys: K[]): Omit<T, K> => {
  const newObj = _.cloneDeep(o)
  keys.forEach(removeKey(newObj))
  return newObj
}
