import { loggerFactory } from './logger.factory'
import * as jsforce from 'jsforce'
import { runQuery, getRecords, deepClean } from './util'
import {
  QueryRequest,
  IdRequest,
  RecordsRequest,
  UpsertRequest,
  SearchRequest,
  JSONObject,
} from '@shingo/sf-api-shared'

const OMIT_FIELDS = [
  'LastModifiedDate',
  'IsDeleted',
  'LastViewedDate',
  'LastReferencedDate',
  'SystemModstamp',
  'CreatedById',
  'CreatedDate',
  'LastModifiedById',
  'JigsawCompanyId',
  'PhotoUrl',
  'MasterRecordId',
  'IsEmailBounced',
  'OtherAddress',
  'LastCUUpdateDate',
  'Contact_Quality__c',
  'MailingAddress',
  'LastCURequestDate',
  'LastActivityDate',
  'JigsawContactId',
  'password',
  'Account',
  'Facilitator_For__r',
  'id',
  'role',
  'RecordType',
]

export class SalesforceService {
  private queryRunner: ReturnType<typeof runQuery>

  constructor(
    SF_URL: string,
    SF_ENV: string,
    SF_USER: string,
    SF_PASS: string,
    private conn = new jsforce.Connection({
      loginUrl: SF_URL,
      instanceUrl: SF_ENV,
    }),
    private log = loggerFactory(),
    private auditLog = loggerFactory('salesforce-api.audit.log'),
  ) {
    this.queryRunner = runQuery(SF_USER, SF_PASS, this.conn)
  }

  async query(queryRequest: QueryRequest): Promise<JSONObject> {
    try {
      let queryString = `SELECT ${queryRequest.fields.join(',')} FROM ${
        queryRequest.table
      }`

      if (queryRequest.clauses) queryString += ' WHERE ' + queryRequest.clauses

      this.log.debug('Executing SOQL: %s', queryString)
      return this.queryRunner(async conn => {
        const res = await conn.query(queryString)
        return new JSONObject(deepClean(res, 'attributes'))
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.query(): %j', error)
      throw error
    }
  }

  async retrieve(idRequest: IdRequest) {
    try {
      return this.queryRunner(async conn => {
        const res = await conn.sobject(idRequest.object).retrieve(idRequest.ids)
        return new JSONObject(deepClean(res, 'attributes'))
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.retrieve(): %j', error)
      throw error
    }
  }

  async create(recordsRequest: RecordsRequest) {
    const records = getRecords(recordsRequest, OMIT_FIELDS)

    try {
      return this.queryRunner(conn => {
        this.auditLog.info('Creating new records: %j', records)
        return conn
          .sobject(recordsRequest.object)
          .create(records)
          .then(o => new JSONObject(o))
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.create(): %j', error)
      throw error
    }
  }

  async update(recordsRequest: RecordsRequest) {
    const records = getRecords(recordsRequest, OMIT_FIELDS)
    try {
      return this.queryRunner(conn => {
        this.auditLog.info('Updating records: %j', records)
        return conn
          .sobject(recordsRequest.object)
          .update(records)
          .then(o => new JSONObject(o))
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.update(): %j', error)
      throw error
    }
  }

  async delete(idRequest: IdRequest) {
    try {
      return this.queryRunner(conn => {
        this.auditLog.info('Deleting records: %j', idRequest.ids)
        return conn
          .sobject(idRequest.object)
          .delete(idRequest.ids)
          .then(o => new JSONObject(o))
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.delete(): %j', error)
      throw error
    }
  }

  async upsert(request: UpsertRequest) {
    try {
      const records = getRecords(request)

      return this.queryRunner(conn => {
        this.auditLog.info('Upsert records for %s: %j', request.object, records)
        return conn
          .sobject(request.object)
          .upsert(records, request.extId)
          .then(o => new JSONObject(o))
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.upsert(): %j', error)
      throw error
    }
  }

  async describe(object: string) {
    try {
      return this.queryRunner(conn =>
        conn
          .sobject(object)
          .describe()
          .then(o => new JSONObject(o)),
      )
    } catch (error) {
      this.log.error('Error in SalesforceService.describe(): %j', error)
      throw error
    }
  }

  async search(searchRequest: SearchRequest) {
    try {
      return this.queryRunner(async conn => {
        // FIXME: jsforce typings are incorrect
        const res: { searchRecords: any[] } = await (conn as any).search(
          `FIND ${searchRequest.search} IN ALL FIELDS RETURNING ${
            searchRequest.retrieve
          }`,
        )
        return new JSONObject(deepClean(res, 'attributes'))
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.search(): %j', error)
      throw error
    }
  }
}
