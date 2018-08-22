import * as path from 'path'
import * as grpc from 'grpc'
import { Options as ProtoOptions, loadSync } from '@grpc/proto-loader'
import { QueryRequest, IdRequest, QueryResponse, RecordsRequest,
  UpsertRequest, SearchRequest} from './shared/messages'
import { promisify } from 'util'
import { ServiceClient } from './server/microservices/salesforce.microservice'
import { bindAll, unjsonobject } from './shared/util'
import { DescribeSObjectResult, RecordResult } from 'jsforce'

const throwOnUndefined = <T>(x: T | undefined): T => {
  if (typeof x === 'undefined') {
    throw new Error('Response is undefined')
  }
  return x
}

export class SalesforceClient {
  client: ServiceClient

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
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).sfservices as grpc.GrpcObject
    const clientClass = protoDescriptor.SalesforceMicroservice as typeof grpc.Client
    this.client = bindAll(new clientClass(address, creds || grpc.credentials.createInsecure()) as ServiceClient)
  }

  /**
   * Query salesforce fields using SOQL SELECT
   * @param req QueryRequest object
   */
  query<T>(req: QueryRequest): Promise<QueryResponse<T>> {
    return promisify(this.client.query)(req)
      .then(throwOnUndefined)
      .then(unjsonobject)
  }

  /**
   * Retrieve salesforce objects by id
   * @param req IdRequest object
   */
  retrieve(req: IdRequest): Promise<object> {
    return promisify(this.client.retrieve)(req)
      .then(throwOnUndefined)
      .then(unjsonobject)
  }

  /**
   * Create a salesforce object
   * @param req RecordsRequest object
   */
  create(req: RecordsRequest): Promise<RecordResult[]> {
    return promisify(this.client.create)(req)
      .then(throwOnUndefined)
      .then(unjsonobject)
  }

  /**
   * Update a salesforce object
   * @param req RecordsRequest object
   */
  update(req: RecordsRequest): Promise<RecordResult[]> {
    return promisify(this.client.update)(req)
      .then(throwOnUndefined)
      .then(unjsonobject)
  }

  /**
   * Delete salesforce objects by id
   * @param req IdRequest object
   */
  delete(req: IdRequest): Promise<RecordResult[]> {
    return promisify(this.client.delete)(req)
      .then(throwOnUndefined)
      .then(unjsonobject)
  }

  /**
   * Upsert salesforce objects
   * @param req UpsertRequest object
   */
  upsert(req: UpsertRequest): Promise<RecordResult[]> {
    return promisify(this.client.upsert)(req)
      .then(throwOnUndefined)
      .then(unjsonobject)
  }

  /**
   * Describe salesforce object
   * @param object Salesforce object to describe
   */
  describe(object: string): Promise<DescribeSObjectResult> {
    return promisify(this.client.describe)({ object })
      .then(throwOnUndefined)
      .then(unjsonobject)
  }

  /**
   * Execute SOSL search
   * @param req SearchRequest object
   */
  search(req: SearchRequest): Promise<{ searchRecords: any[] }> {
    return promisify(this.client.search)(req)
      .then(throwOnUndefined)
      .then(unjsonobject)
  }
}
