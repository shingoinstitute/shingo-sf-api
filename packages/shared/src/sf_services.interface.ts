import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type, plainToClass } from 'class-transformer'
import { RequireKeys } from './util'
import { sfservices as M } from './sf_services.proto'
// tslint:disable:max-classes-per-file

export class QueryRequest
  implements RequireKeys<M.QueryRequest, 'fields' | 'table'> {
  @IsString({ each: true })
  fields: string[]

  @IsString()
  table: string

  @IsOptional()
  @IsString()
  clauses?: string

  constructor(req: RequireKeys<M.QueryRequest, 'fields' | 'table'>) {
    this.fields = req.fields || []
    this.table = req.table
    this.clauses = req.clauses
  }
}

export class IdRequest implements Required<M.IdRequest> {
  @IsString()
  object: string

  @IsString({ each: true })
  ids: string[]

  constructor(req: Required<M.IdRequest>) {
    this.object = req.object
    this.ids = req.ids
  }
}

export class RecordsRequest<T extends object = object>
  implements Required<M.RecordsRequest> {
  @IsString()
  object: string

  @ValidateNested({ each: true })
  @Type(() => JSONObject)
  records: Array<JSONObject<T>>

  constructor(req: Required<M.RecordsRequest>) {
    this.object = req.object
    this.records = plainToClass(JSONObject, req.records) as Array<JSONObject<T>>
  }
}

export class JSONObject<T extends object = object>
  implements Required<M.JSONObject> {
  @IsString()
  readonly contents: string

  private _parsed: T | undefined

  parse(): T {
    if (typeof this._parsed === 'undefined') {
      this._parsed = JSON.parse(this.contents)
    }

    return this._parsed as T
  }

  constructor(obj: string | T) {
    this.contents = typeof obj === 'string' ? obj : JSON.stringify(obj)
  }
}

export class UpsertRequest<T extends object = object>
  implements Required<M.UpsertRequest> {
  @IsString()
  object: string

  @ValidateNested({ each: true })
  @Type(() => JSONObject)
  records: Array<JSONObject<T>>

  @IsString()
  extId: string

  constructor(req: Required<M.UpsertRequest>) {
    this.object = req.object
    this.extId = req.extId
    this.records = plainToClass(JSONObject, req.records) as Array<JSONObject<T>>
  }
}

export class DescribeRequest implements Required<M.DescribeRequest> {
  @IsString()
  object: string

  constructor(obj: string | Required<M.DescribeRequest>) {
    this.object = typeof obj === 'string' ? obj : obj.object
  }
}

export class SearchRequest implements Required<M.SearchRequest> {
  @IsString()
  search: string

  @IsString()
  retrieve: string

  constructor(search: string, retrieve: string)
  constructor(req: Required<M.SearchRequest>)
  constructor(obj: string | Required<M.SearchRequest>, retrieve?: string) {
    this.search = typeof obj === 'string' ? obj : obj.search
    this.retrieve = typeof obj === 'string' ? retrieve! : obj.retrieve
  }
}
