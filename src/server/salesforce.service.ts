import { loggerFactory } from '../shared/logger.service'
import * as jsforce from 'jsforce'
import deepClean from 'deep-cleaner'
import { runQuery, getRecords, jsonobject } from '../shared/util'
import { QueryRequest, IdRequest, RecordsRequest,
  UpsertRequest, SearchRequest, JSONObject } from '../shared/messages'

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
    private conn = new jsforce.Connection({ loginUrl: SF_URL, instanceUrl: SF_ENV }),
    private log = loggerFactory(),
    private auditLog = loggerFactory('salesforce-api.audit.log')
  ) {
    this.queryRunner = runQuery(SF_USER, SF_PASS, this.conn)
  }

  async query(queryRequest: QueryRequest): Promise<JSONObject> {
    try {
      if (!queryRequest.table || queryRequest.table === '' ||
        !queryRequest.fields || queryRequest.fields.length === 0) {
        throw new Error('Invalid Query Request')
      }

      let queryString = `SELECT ${queryRequest.fields.join(',')} FROM ${queryRequest.table}`

      if (queryRequest.clauses) queryString += ' WHERE ' + queryRequest.clauses

      this.log.debug('Executing SOQL: %s', queryString)
      return this.queryRunner(async conn => {
        const res = await conn.query(queryString)
        // TODO: remove deepClean once I can verify it doesn't change functionality
        deepClean(res, 'attributes')
        return jsonobject(res)
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
        deepClean(res, 'attributes')
        return jsonobject(res)
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
        return conn.sobject(recordsRequest.object).create(records).then(jsonobject)
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
        return conn.sobject(recordsRequest.object).update(records).then(jsonobject)
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
          // jsforce typings arent up to date
        ; return (conn.sobject(idRequest.object).delete(idRequest.ids) as any as Promise<JSONObject>).then(jsonobject)
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
        return conn.sobject(request.object).upsert(records, request.extId).then(jsonobject)
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.upsert(): %j', error)
      throw error
    }
  }

  async describe(object: string) {
    try {
      return this.queryRunner(conn =>
        conn.sobject(object).describe().then(jsonobject)
      )
    } catch (error) {
      this.log.error('Error in SalesforceService.describe(): %j', error)
      throw error
    }
  }

  async search(searchRequest: SearchRequest) {
    try {
      return this.queryRunner(async conn => {
        // tslint:disable-next-line:max-line-length
        const res = await (conn as any).search(`FIND ${searchRequest.search} IN ALL FIELDS RETURNING ${searchRequest.retrieve}`)
        deepClean(res, 'attributes')
        return jsonobject(res)
      })
    } catch (error) {
      this.log.error('Error in SalesforceService.search(): %j', error)
      throw error
    }
  }
}
