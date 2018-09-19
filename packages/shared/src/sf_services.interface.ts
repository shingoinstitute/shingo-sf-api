import {
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayNotContains,
} from 'class-validator'
import { Type, plainToClass } from 'class-transformer'
import { RequireKeys } from './util'
import { sfservices as M } from './sf_services.proto'
// tslint:disable:max-classes-per-file

export class QueryRequest
  implements RequireKeys<M.QueryRequest, 'fields' | 'table'> {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  fields!: string[]

  @IsNotEmpty()
  @IsString()
  table!: string

  @IsOptional()
  @IsString()
  clauses?: string

  constructor(req: RequireKeys<M.QueryRequest, 'fields' | 'table'>) {
    if (typeof req !== 'undefined') {
      this.fields = req.fields || []
      this.table = req.table
      this.clauses = req.clauses
    }
  }
}

export class IdRequest implements Required<M.IdRequest> {
  @IsString()
  object!: string

  @IsString({ each: true })
  ids!: string[]

  constructor(req: Required<M.IdRequest>) {
    if (typeof req !== 'undefined') {
      this.object = req.object
      this.ids = req.ids
    }
  }
}

export class RecordsRequest implements Required<M.RecordsRequest> {
  @IsString()
  object!: string

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => JSONObject)
  records!: JSONObject[]

  constructor(req: Required<M.RecordsRequest>) {
    if (typeof req !== 'undefined') {
      this.object = req.object
      this.records = plainToClass(JSONObject, req.records) as JSONObject[]
    }
  }
}

export interface JSONObj {
  [key: string]: JSON
}
export interface JSONArray extends Array<JSON> {}
export type JSON = null | string | number | JSONArray | JSONObj

export class JSONObject implements Required<M.JSONObject> {
  @IsString()
  readonly contents!: string

  private _parsed: JSON | undefined

  get value(): JSON {
    if (typeof this._parsed === 'undefined') {
      this._parsed = JSON.parse(this.contents)
    }

    return this._parsed as JSON
  }

  constructor(obj: JSON | object | Required<M.JSONObject>) {
    if (typeof obj !== 'undefined') {
      this.contents =
        typeof obj === 'object' &&
        (obj as any).contents &&
        typeof (obj as any).contents === 'string'
          ? (obj as Required<M.JSONObject>).contents
          : JSON.stringify(obj)
    }
  }
}

export class UpsertRequest implements Required<M.UpsertRequest> {
  @IsString()
  object!: string

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => JSONObject)
  records!: JSONObject[]

  @IsString()
  extId!: string

  constructor(req: Required<M.UpsertRequest>) {
    if (typeof req !== 'undefined') {
      this.object = req.object
      this.extId = req.extId
      this.records = plainToClass(JSONObject, req.records) as JSONObject[]
    }
  }
}

export class DescribeRequest implements Required<M.DescribeRequest> {
  @IsString()
  object!: string

  constructor(obj: string | Required<M.DescribeRequest>) {
    if (typeof obj !== 'undefined') {
      this.object = typeof obj === 'string' ? obj : obj.object
    }
  }
}

export class SearchRequest implements Required<M.SearchRequest> {
  @IsString()
  search!: string

  @IsString()
  retrieve!: string

  constructor(search: string, retrieve: string)
  constructor(req: Required<M.SearchRequest>)
  constructor(obj: string | Required<M.SearchRequest>, retrieve?: string) {
    if (typeof obj !== 'undefined') {
      this.search = typeof obj === 'string' ? obj : obj.search
      this.retrieve = typeof obj === 'string' ? retrieve! : obj.retrieve
    }
  }
}
