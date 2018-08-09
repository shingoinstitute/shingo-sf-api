import * as path from 'path'
import * as grpc from 'grpc'
import { Options as ProtoOptions, loadSync } from '@grpc/proto-loader'
import { QueryRequest, IdRequest, QueryResponse, RecordsRequest,
  UpsertRequest, JSONObject, DescribeRequest } from './shared/messages'
import { promisify } from 'util'

export class SalesforceService {
  client: any

  constructor(address: string) {
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
    const clientClass = protoDescriptor.SalesforceMicroservice as any
    this.client = new clientClass(address, grpc.credentials.createInsecure())
  }

  query<T>(req: QueryRequest): Promise<QueryResponse<T>> {
    return promisify<QueryRequest, JSONObject>(this.client.query.bind(this.client))(req)
      .then(res => JSON.parse(res.contents))
  }

  retrieve(req: IdRequest): Promise<object> {
    return promisify<IdRequest, JSONObject>(this.client.retrieve.bind(this.client))(req)
      .then(res => JSON.parse(res.contents))
  }

  create(req: RecordsRequest): Promise<object> {
    return promisify<RecordsRequest, JSONObject>(this.client.create.bind(this.client))(req)
      .then(res => JSON.parse(res.contents))
  }

  update(req: RecordsRequest) {
    return promisify<RecordsRequest, JSONObject>(this.client.update.bind(this.client))(req)
      .then(res => JSON.parse(res.contents))
  }

  delete(req: IdRequest) {
    return promisify<IdRequest, JSONObject>(this.client.delete.bind(this.client))(req)
      .then(res => JSON.parse(res.contents))
  }

  upsert(req: UpsertRequest) {
    return promisify<UpsertRequest, JSONObject>(this.client.upsert.bind(this.client))(req)
      .then(res => JSON.parse(res.contents))
  }

  describe(object: string) {
    return promisify<DescribeRequest, JSONObject>(this.client.upsert.bind(this.client))({ object })
      .then(res => JSON.parse(res.contents))
  }
}
