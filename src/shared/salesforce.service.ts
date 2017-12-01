import { LoggerService } from './logger.service';
import * as _ from 'lodash';
import * as jsforce from 'jsforce';
import * as deepClean from 'deep-cleaner';

export interface QueryRequest {
    action: string,
    fields: string[],
    table: string,
    clauses?: string
}

export interface IdRequest {
    object: string,
    ids: string[]
}

export interface JSONObject {
    contents: string
}

export interface RecordsRequest {
    object: string,
    records: JSONObject[]
}

export interface SearchRequest {
    search: string,
    retrieve: string
}

const OMIT_FIELDS = ['LastModifiedDate',
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
    "password",
    "Account",
    "Facilitator_For__r",
    "id",
    "role",
    "RecordType"
]

export class SalesforceService {
    static conn = new jsforce.Connection({ loginUrl: process.env.SF_URL, instanceURL: process.env.SF_ENV });

    static log = new LoggerService();

    static auditLog = new LoggerService('salesforce-api.audit.log');

    static async query(queryRequest: QueryRequest) {
        // this.conn = bluebird.promisifyAll(this.conn);
        let queryString = queryRequest.action;
        queryRequest.fields.forEach((f, i) => { queryString += " " + f + (i < queryRequest.fields.length - 1 ? "," : "") });

        queryString += " FROM " + queryRequest.table;
        if (queryRequest.clauses) queryString += " WHERE " + queryRequest.clauses;

        SalesforceService.log.debug('Executing SOQL: %s', queryString);
        try {
            // Login into Salesforce
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS);

            // Execute query
            let records = new Array()
            let res = await SalesforceService.conn.query(queryString);
            deepClean(res, 'attributes');
            SalesforceService.conn.logout();
            return Promise.resolve({ contents: JSON.stringify(res) });

        } catch (error) {
            SalesforceService.log.error('Error in SalesforceService.query(): %j', error);
            return Promise.reject(error);
        }
    }

    static async retrieve(idRequest: IdRequest) {
        try {
            // Login to Salesforce
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS);
            // Retrieve records for given object and ids
            let res = await SalesforceService.conn.sobject(idRequest.object).retrieve(idRequest.ids);
            deepClean(res, 'attributes');
            SalesforceService.conn.logout();
            return Promise.resolve({ contents: JSON.stringify(res) });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static async create(recordsRequest: RecordsRequest) {
        let records = new Array();
        recordsRequest.records.forEach(record => {
            let newRecord = _.omit(JSON.parse(record.contents), OMIT_FIELDS);
            records.push(newRecord);
        });
        try {
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS);
            let res = await SalesforceService.conn.sobject(recordsRequest.object).create(records);
            SalesforceService.conn.logout();
            SalesforceService.auditLog.warn('Creating new records: %j', records);
            return Promise.resolve({ contents: JSON.stringify(res) });
        } catch (error) {
            SalesforceService.log.error('Error in SalesforceService.create(): %j', error);
            return Promise.reject(error);
        }
    }

    static async update(recordsRequest: RecordsRequest) {
        let records = new Array();
        recordsRequest.records.forEach(record => {
            let newRecord = _.omit(JSON.parse(record.contents), OMIT_FIELDS);
            records.push(newRecord)
        });
        try {
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS);
            let res = await SalesforceService.conn.sobject(recordsRequest.object).update(records);
            SalesforceService.conn.logout();
            SalesforceService.auditLog.warn('Updating records: %j', records);
            return Promise.resolve({ contents: JSON.stringify(res) });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static async delete(idRequest: IdRequest) {
        try {
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS);
            let res = await SalesforceService.conn.sobject(idRequest.object).delete(idRequest.ids);
            SalesforceService.conn.logout();
            SalesforceService.auditLog.warn('Deleting records: %j', idRequest.ids);
            return Promise.resolve({ contents: JSON.stringify(res) });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static async upsert(recordsRequest: RecordsRequest) {
        try {
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS)
            let res = await SalesforceService.conn.sobject(recordsRequest.object).upsert(recordsRequest.records);
            SalesforceService.conn.logout();
            return Promise.resolve({ contents: JSON.stringify(res) });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static async describe(object: string) {
        try {
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS);
            let res = await SalesforceService.conn.sobject(object).describe();
            SalesforceService.conn.logout();
            return Promise.resolve({ contents: JSON.stringify(res) });
        } catch (error) {
            return Promise.reject(error);
        }
    }

    static async search(searchRequest: SearchRequest) {
        try {
            await SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS);
            let res = await SalesforceService.conn.search(`FIND ${searchRequest.search} IN ALL FIELDS RETURNING ${searchRequest.retrieve}`);
            deepClean(res, 'attributes');
            SalesforceService.conn.logout();
            return Promise.resolve({ contents: JSON.stringify(res) });
        } catch (error) {
            return Promise.reject(error);
        }
    }
}