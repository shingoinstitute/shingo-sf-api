import * as path from 'path'
import * as grpc from 'grpc'
import { Options as ProtoOptions, loadSync } from '@grpc/proto-loader'
import {
  sfservices as M,
  RequireKeys,
  DeepRequired,
} from '@shingo/sf-api-shared'
import {
  bindAll,
  promisifyAll,
  mapUndefined,
  unjsonify,
  parseError,
  handleRecordResults,
} from './util'
import {
  DescribeSObjectResult,
  RecordResult,
  QueryResult,
  SuccessResult /* tslint:disable:no-implicit-dependencies */,
} from 'jsforce' /* tslint:enable:no-implicit-dependencies */
import { PromisifyAll } from './promisify-fix'

const throwOnUndefined = <T>(x: T | undefined): T => {
  if (typeof x === 'undefined') {
    throw new Error('Response is undefined')
  }
  return x
}

interface UpsertRequest {
  object: string
  records: object[]
  extId: string
}

interface RecordsRequest {
  object: string
  records: object[]
}

const unjsonobject = mapUndefined(unjsonify)
const toJSONObject = (x: object): Required<M.JSONObject> => ({
  contents: JSON.stringify(x),
})
const toRecordsRequest = ({
  object,
  records,
}: RecordsRequest): DeepRequired<M.RecordsRequest> => ({
  object,
  records: records.map(toJSONObject),
})
const toUpsertRequest = ({
  object,
  records,
  extId,
}: UpsertRequest): DeepRequired<M.UpsertRequest> => ({
  object,
  records: records.map(toJSONObject),
  extId,
})

export class SalesforceClient {
  client: PromisifyAll<M.SalesforceMicroserviceClient>

  constructor(address: string, creds?: grpc.ChannelCredentials) {
    const protoFile = path.join(__dirname, './proto', 'sf_services.proto')
    const options: ProtoOptions = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
    const packageDefinition = loadSync(protoFile, options)
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
      .sfservices as grpc.GrpcObject
    const clientClass = protoDescriptor.SalesforceMicroservice as typeof grpc.Client
    this.client = promisifyAll(
      bindAll(new clientClass(
        address,
        creds || grpc.credentials.createInsecure(),
      ) as M.SalesforceMicroserviceClient),
    )
  }

  /**
   * Query salesforce fields using SOQL SELECT
   * @param req QueryRequest object
   */
  query<T>(
    req: RequireKeys<M.QueryRequest, 'fields' | 'table'>,
  ): Promise<QueryResult<T>> {
    return this.client
      .Query(req)
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<QueryResult<T>>
  }

  /**
   * Retrieve salesforce objects by id
   * @param req IdRequest object
   */
  retrieve(req: Required<M.IdRequest>): Promise<unknown> {
    return this.client
      .Retrieve(req)
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined)
  }

  /**
   * Create a salesforce object
   * @param req RecordsRequest object
   */
  create(req: { object: string; records: object[] }): Promise<SuccessResult[]> {
    return (this.client
      .Create(toRecordsRequest(req))
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>).then(
      handleRecordResults('Unable to create all requested records'),
    )
  }

  /**
   * Update a salesforce object
   * @param req RecordsRequest object
   */
  update(req: RecordsRequest): Promise<SuccessResult[]> {
    return (this.client
      .Update(toRecordsRequest(req))
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>).then(
      handleRecordResults('Unable to update all requested records'),
    )
  }

  /**
   * Delete salesforce objects by id
   * @param req IdRequest object
   */
  delete(req: Required<M.IdRequest>): Promise<SuccessResult[]> {
    return (this.client
      .Delete(req)
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>).then(
      handleRecordResults('Unable to delete all requested records'),
    )
  }

  /**
   * Upsert salesforce objects
   * @param req UpsertRequest object
   */
  upsert(req: UpsertRequest): Promise<SuccessResult[]> {
    return (this.client
      .Upsert(toUpsertRequest(req))
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>).then(
      handleRecordResults('Unable to upsert all requested records'),
    )
  }

  /**
   * Describe salesforce object
   * @param object Salesforce object to describe
   */
  describe(object: string): Promise<DescribeSObjectResult> {
    return this.client
      .Describe({ object })
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<DescribeSObjectResult>
  }

  /**
   * Execute SOSL search
   * @param req SearchRequest object
   */
  search(
    req: Required<M.SearchRequest>,
  ): Promise<{ searchRecords: Array<unknown> }> {
    return this.client
      .Search(req)
      .catch(parseError)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<{ searchRecords: Array<unknown> }>
  }
}
