import * as grpc from 'grpc'
import * as path from 'path'
import { SalesforceService } from '../salesforce.service'
import { loggerFactory } from '../logger.factory'
import { handleUnary } from '../util'
import { Options as ProtoOptions, loadSync } from '@grpc/proto-loader'
import {
  sfservices,
  validateInput,
  QueryRequest,
  IdRequest,
  RecordsRequest,
  UpsertRequest,
  DescribeRequest,
  SearchRequest,
} from '@shingo/sf-api-shared'
import { pipe } from '../fp'

export interface EnvironmentVars {
  SF_ENV: string
  SF_URL: string
  SF_USER: string
  SF_PASS: string
}
// tslint:disable:variable-name

const makeCall = handleUnary(loggerFactory())

export class SalesforceMicroservice
  implements sfservices.SalesforceMicroserviceImplementation {
  service: grpc.ServiceDefinition<
    sfservices.SalesforceMicroserviceImplementation
  >

  constructor(
    env: EnvironmentVars,
    private sfservice = new SalesforceService(
      env.SF_URL,
      env.SF_ENV,
      env.SF_USER,
      env.SF_PASS,
    ),
  ) {
    const protoFile = path.join(__dirname, '../proto', 'sf_services.proto')
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
    this.service = (protoDescriptor.SalesforceMicroservice as any).service
  }

  Query = makeCall(
    'query',
    pipe(
      validateInput(QueryRequest),
      req => req.then(q => this.sfservice.query(q)),
    ),
  )

  Retrieve = makeCall(
    'retrieve',
    pipe(
      validateInput(IdRequest),
      req => req.then(id => this.sfservice.retrieve(id)),
    ),
  )

  Create = makeCall(
    'create',
    pipe(
      validateInput(RecordsRequest),
      req => req.then(r => this.sfservice.create(r)),
    ),
  )

  Update = makeCall(
    'update',
    pipe(
      validateInput(RecordsRequest),
      req => req.then(r => this.sfservice.update(r)),
    ),
  )

  Delete = makeCall(
    'delete',
    pipe(
      validateInput(IdRequest),
      req => req.then(id => this.sfservice.delete(id)),
    ),
  )

  Upsert = makeCall(
    'upsert',
    pipe(
      validateInput(UpsertRequest),
      req => req.then(u => this.sfservice.upsert(u)),
    ),
  )

  Describe = makeCall(
    'describe',
    pipe(
      validateInput(DescribeRequest),
      req => req.then(d => this.sfservice.describe(d.object)),
    ),
  )

  Search = makeCall(
    'search',
    pipe(
      validateInput(SearchRequest),
      req => req.then(s => this.sfservice.search(s)),
    ),
  )
}
