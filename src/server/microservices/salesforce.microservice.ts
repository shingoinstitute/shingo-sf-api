import * as grpc from 'grpc'
import * as path from 'path'
import { SalesforceService } from '../salesforce.service'
import { QueryRequest, JSONObject, IdRequest,
    RecordsRequest, UpsertRequest, DescribeRequest,
    SearchRequest, QueryResponse} from '../../shared/messages'
import { loggerFactory } from '../../shared/logger.service'
import { handleUnary } from '../../shared/util'
import { Options as ProtoOptions, loadSync } from '@grpc/proto-loader'

export interface EnvironmentVars {
  SF_ENV: string
  SF_URL: string
  SF_USER: string
  SF_PASS: string
}

export interface ServiceImplementation {
  query: grpc.handleUnaryCall<QueryRequest, JSONObject>
  retrieve: grpc.handleUnaryCall<IdRequest, JSONObject>
  create: grpc.handleUnaryCall<RecordsRequest, JSONObject>
  update: grpc.handleUnaryCall<RecordsRequest, JSONObject>
  delete: grpc.handleUnaryCall<IdRequest, JSONObject>
  upsert: grpc.handleUnaryCall<UpsertRequest, JSONObject>
  describe: grpc.handleUnaryCall<DescribeRequest, JSONObject>
  search: grpc.handleUnaryCall<SearchRequest, JSONObject>
}

const makeCall = handleUnary(loggerFactory())

export class SalesforceMicroservice implements ServiceImplementation {

  service: grpc.ServiceDefinition<ServiceImplementation>
  private sfservice: SalesforceService

  constructor(env: EnvironmentVars) {
    const protoFile = path.join(__dirname, '../../proto', 'sf_services.proto')
    const options: ProtoOptions = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
    const packageDefinition = loadSync(protoFile, options)
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).sfservices as grpc.GrpcObject
    this.service = (protoDescriptor.SalesforceMicroservice as any).service
    this.sfservice = new SalesforceService(env.SF_URL, env.SF_ENV, env.SF_USER, env.SF_PASS)
  }

  query = makeCall('query', (req: QueryRequest) => this.sfservice.query(req))
  retrieve = makeCall('retrieve', (req: IdRequest) => this.sfservice.retrieve(req))
  create = makeCall('create', (req: RecordsRequest) => this.sfservice.create(req))
  update = makeCall('update', (req: RecordsRequest) => this.sfservice.update(req))
  delete = makeCall('delete', (req: IdRequest) => this.sfservice.delete(req))
  upsert = makeCall('upsert', (req: UpsertRequest) => this.sfservice.upsert(req))
  describe = makeCall('describe', (req: DescribeRequest) => this.sfservice.describe(req.object))
  search = makeCall('search', (req: SearchRequest) => this.sfservice.search(req))
}
