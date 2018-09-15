import * as path from 'path'
import * as grpc from 'grpc'
import { Options as ProtoOptions, loadSync } from '@grpc/proto-loader'
import {
  QueryRequest,
  IdRequest,
  RecordsRequest,
  UpsertRequest,
  SearchRequest,
  sfservices,
} from '@shingo/sf-api-shared'
import { bindAll, promisifyAll, mapUndefined, unjsonify } from './util'
// tslint:disable-next-line:no-implicit-dependencies
import { DescribeSObjectResult, RecordResult, QueryResult } from 'jsforce'
import { PromisifyAll } from './promisify-fix'

const throwOnUndefined = <T>(x: T | undefined): T => {
  if (typeof x === 'undefined') {
    throw new Error('Response is undefined')
  }
  return x
}

const unjsonobject = mapUndefined(unjsonify)

export class SalesforceClient {
  client: PromisifyAll<sfservices.SalesforceMicroserviceClient>

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
      ) as sfservices.SalesforceMicroserviceClient),
    )
  }

  /**
   * Query salesforce fields using SOQL SELECT
   * @param req QueryRequest object
   */
  query<T>(req: QueryRequest): Promise<QueryResult<T>> {
    return this.client
      .Query(req)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<QueryResult<T>>
  }

  /**
   * Retrieve salesforce objects by id
   * @param req IdRequest object
   */
  retrieve(req: IdRequest): Promise<unknown> {
    return this.client
      .Retrieve(req)
      .then(unjsonobject)
      .then(throwOnUndefined)
  }

  /**
   * Create a salesforce object
   * @param req RecordsRequest object
   */
  create(req: RecordsRequest): Promise<RecordResult[]> {
    return this.client
      .Create(req)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>
  }

  /**
   * Update a salesforce object
   * @param req RecordsRequest object
   */
  update(req: RecordsRequest): Promise<RecordResult[]> {
    return this.client
      .Update(req)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>
  }

  /**
   * Delete salesforce objects by id
   * @param req IdRequest object
   */
  delete(req: IdRequest): Promise<RecordResult[]> {
    return this.client
      .Delete(req)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>
  }

  /**
   * Upsert salesforce objects
   * @param req UpsertRequest object
   */
  upsert(req: UpsertRequest): Promise<RecordResult[]> {
    return this.client
      .Upsert(req)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<RecordResult[]>
  }

  /**
   * Describe salesforce object
   * @param object Salesforce object to describe
   */
  describe(object: string): Promise<DescribeSObjectResult> {
    return this.client
      .Describe({ object })
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<DescribeSObjectResult>
  }

  /**
   * Execute SOSL search
   * @param req SearchRequest object
   */
  search(req: SearchRequest): Promise<{ searchRecords: Array<unknown> }> {
    return this.client
      .Search(req)
      .then(unjsonobject)
      .then(throwOnUndefined) as Promise<{ searchRecords: Array<unknown> }>
  }
}
