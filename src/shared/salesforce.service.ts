import * as jsforce from 'jsforce';
import * as deepClean from 'deep-cleaner';

export interface QueryRequest {
    action : string,
    fields : string[],
    table : string,
    clauses? : string
}

export interface IdRequest {
    object : string,
    ids : string[]
}

export interface RecordsRequest {
    object : string,
    records: object[]
}

export interface SearchRequest {
    search : string,
    retrieve : string
}

export class SalesforceService {
    static conn = new jsforce.Connection({loginUrl: process.env.SF_URL, instanceURL: process.env.SF_ENV});

    static async query(queryRequest : QueryRequest) {
        let queryString = queryRequest.action;
        queryRequest.fields.forEach((f,i)=>{ queryString += " " + f + (i < queryRequest.fields.length - 1 ? "," : "") });

        queryString += " FROM " + queryRequest.table;
        if(queryRequest.clauses) queryString += " WHERE " + queryRequest.clauses;

        // Login into Salesforce
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            // Execute query
            let records = new Array()
            SalesforceService.conn.query(queryString)
            .on("record", (record) => { 
                deepClean(record, 'attributes');
                records.push(record) ;
            })
            .on("end", () => {
                Promise.resolve({ records });
                SalesforceService.conn.logout();
            })
            .on("error", (err) => {
                console.log("Error during Query: ", err);
                Promise.reject(err);
                SalesforceService.conn.logout();
            })
            .run({ autoFetch: true, maxFetch: 10000});
        });
    }

    static async retrieve(idRequest : IdRequest) {
        // Login to Salesforce
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            // Retrieve records for given object and ids
            SalesforceService.conn.sobject(idRequest.object).retrieve(idRequest.ids, (err, res)=> { 
                if(err) return Promise.reject(err);
                deepClean(res, 'attributes');
                Promise.resolve(res);
                SalesforceService.conn.logout();
            });
        });
    }

    static async create(recordsRequest : RecordsRequest) {
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            SalesforceService.conn.sobject(recordsRequest.object).create(recordsRequest.records, (err, res)=> { 
                if(err) return Promise.reject(err);
                Promise.resolve(res);
                SalesforceService.conn.logout();
            });
        });
    }

    static async update(recordsRequest : RecordsRequest) {
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            SalesforceService.conn.sobject(recordsRequest.object).update(recordsRequest.records, (err, res)=> { 
                if(err) return Promise.reject(err);
                Promise.resolve(res);
                SalesforceService.conn.logout();
            });
        });
    }

    static async delete(idRequest : IdRequest) {
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            SalesforceService.conn.sobject(idRequest.object).delete(idRequest.ids, (err, res)=> { 
                if(err) return Promise.reject(err);
                Promise.resolve(res);
                SalesforceService.conn.logout();
            });
        });
    }

    static async upsert(recordsRequest : RecordsRequest) {
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            SalesforceService.conn.sobject(recordsRequest.object).upsert(recordsRequest.records, (err, res)=> { 
                if(err) return Promise.reject(err);
                Promise.resolve(res);
                SalesforceService.conn.logout();
            });
        });
    }

    static async describe(object : string){
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            SalesforceService.conn.sobject(object).describe((err, res)=> { 
                if(err) return Promise.reject(err);
                Promise.resolve(res);
                SalesforceService.conn.logout();
            });
        });
    }

    static async search(searchRequest : SearchRequest) {
        SalesforceService.conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return Promise.reject(err);

            SalesforceService.conn.search(`FIND ${searchRequest.search} IN ALL FIELDS RETURNING ${searchRequest.retrieve}`, (err, res) =>{
                if(err) return Promise.reject(err);
                res.searchRecords.forEach((el, i)=>{
                    deepClean(res.searchRecords[i], 'attributes');
                });
                Promise.resolve(res);
                SalesforceService.conn.logout();
            })
        });
    }
}