import { Connection } from 'jsforce'
import { ServiceError, status as Status, Metadata, handleUnaryCall } from 'grpc'
import { Logger } from 'winston'
import { RecordsRequest, Omit } from '@shingo/sf-api-shared'
import _ from 'lodash'

/**
 * Authenticates a connection to salesforce and calls a function with the logged in connection
 * @param username Salesforce username
 * @param password Salesforce password
 * @param connection JSForce connection object
 * @param fn The function to run
 */
export const runQuery = (
  username: string,
  password: string,
  connection: Connection,
) => <T>(fn: ((conn: Connection) => Promise<T>)) =>
  connection
    .login(username, password)
    .then(() => fn(connection))
    .then(res => {
      connection.logout()
      return res
    })

export class SError extends Error implements ServiceError {
  code?: Status
  metadata?: Metadata

  constructor(error: Error | object, status?: Status) {
    super()
    this.message = (error as Error).message
    this.name = (error as Error).name || 'Error'
    this.metadata = new Metadata()
    const stringErr = JSON.stringify(error, (_key, value) => {
      if (value instanceof Error) {
        const err: any = {}
        Object.getOwnPropertyNames(error).forEach(k => {
          err[k] = (value as any)[k]
        })

        return err
      }

      return value
    })
    this.metadata.add('error-bin', Buffer.from(stringErr))
    this.code = status || Status.INTERNAL
  }
}

/**
 * Handles a GRPC unary request
 * @param logger Logger instance
 * @param name Function name for logging
 * @param fn Handler function implementation
 */
export const handleUnary = (logger: Logger) => <Req, Res>(
  name: string,
  fn: (req: Req) => Promise<Res>,
): handleUnaryCall<Req, Res> => (call, cb) => {
  fn(call.request)
    .then(record => cb(null, record))
    .catch(error => {
      logger.error(`Error in ${name}(): %j`, error)
      cb(new SError(error), null)
    })
}

export const getRecords = (req: RecordsRequest, omit: string[] = []) =>
  req.records.map(record => {
    const val = record.value
    return typeof val === 'object' ? _.omit(val, omit) : val
  })

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

export const deepClean = <T extends object, K extends keyof any>(
  o: T,
  ...keys: K[]
): Omit<T, K> => {
  const newObj = _.cloneDeep(o)
  keys.forEach(removeKey(newObj))
  return newObj
}
