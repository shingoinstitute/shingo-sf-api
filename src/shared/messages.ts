// these MUST match the message definitions in sf_services.proto
// Ideally this file would be generated as part of a build step

export interface QueryRequest {
  fields: string[]
  table: string
  clauses?: string
}

export interface QueryResponse<T = object> {
  done: boolean
  totalSize: number
  records: T[]
}

export interface IdRequest {
  object: string
  ids: string[]
}

export interface JSONObject {
  contents: string
}

export interface RecordsRequest {
  object: string
  records: JSONObject[]
}

export interface UpsertRequest {
  object: string
  records: JSONObject[]
  extId: string
}

export interface DescribeRequest {
  object: string
}

export interface SearchRequest {
  search: string
  retrieve: string
}
