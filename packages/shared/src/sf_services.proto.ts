import * as grpc from 'grpc'

export namespace sfservices {
  export interface SalesforceMicroserviceImplementation {
    Query: grpc.handleUnaryCall<QueryRequest, JSONObject>
    Retrieve: grpc.handleUnaryCall<IdRequest, JSONObject>
    Create: grpc.handleUnaryCall<RecordsRequest, JSONObject>
    Update: grpc.handleUnaryCall<RecordsRequest, JSONObject>
    Delete: grpc.handleUnaryCall<IdRequest, JSONObject>
    Upsert: grpc.handleUnaryCall<UpsertRequest, JSONObject>
    Describe: grpc.handleUnaryCall<DescribeRequest, JSONObject>
    Search: grpc.handleUnaryCall<SearchRequest, JSONObject>
  }
  export interface SalesforceMicroserviceClient extends grpc.Client {
    Query(argument: QueryRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Query(argument: QueryRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Query(argument: QueryRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Query(argument: QueryRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Retrieve(argument: IdRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Retrieve(argument: IdRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Retrieve(argument: IdRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Retrieve(argument: IdRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Create(argument: RecordsRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Create(argument: RecordsRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Create(argument: RecordsRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Create(argument: RecordsRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Update(argument: RecordsRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Update(argument: RecordsRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Update(argument: RecordsRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Update(argument: RecordsRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Delete(argument: IdRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Delete(argument: IdRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Delete(argument: IdRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Delete(argument: IdRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Upsert(argument: UpsertRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Upsert(argument: UpsertRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Upsert(argument: UpsertRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Upsert(argument: UpsertRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Describe(argument: DescribeRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Describe(argument: DescribeRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Describe(argument: DescribeRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Describe(argument: DescribeRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Search(argument: SearchRequest, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Search(argument: SearchRequest, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Search(argument: SearchRequest, metadata: grpc.Metadata | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
    Search(argument: SearchRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<JSONObject>): grpc.ClientUnaryCall
  }
  export interface JSONObject {
    contents?: string
  }
  export interface QueryRequest {
    action?: string
    fields?: Array<string>
    table?: string
    clauses?: string
  }
  export interface IdRequest {
    object?: string
    ids?: Array<string>
  }
  export interface RecordsRequest {
    object?: string
    records?: Array<JSONObject>
  }
  export interface UpsertRequest {
    object?: string
    records?: Array<JSONObject>
    extId?: string
  }
  export interface DescribeRequest {
    object?: string
  }
  export interface SearchRequest {
    search?: string
    retrieve?: string
  }
}