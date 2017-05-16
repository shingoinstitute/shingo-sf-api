import { Controller } from 'nest.js';
import { MessagePattern } from 'nest.js/microservices';
import * as request from 'request';
import * as jsforce from 'jsforce';

/**
 * @desc :: Symbol to store Salesforce Connection
 */
let conn;

/**
 * @desc :: A RPC controller to handle interfacing with our Salesforce REST API
 * @method query :: Message pattern { cmd: 'soql_query' } -- Execute SOQL Query
 * @method retrieve :: Message pattern { cmd: 'retrieve' } -- Retrieve record by Id
 * @method create :: Message pattern { cmd: 'create' } -- Create new record(s)
 * @method update :: Message pattern { cmd: 'update' } -- Update record(s) by Id
 * @method delete :: Message pattern { cmd: 'delete' } -- Delete record(s) by Id
 * @method upsert :: Message pattern { cmd: 'upsert' } -- Upsert records by Ext_Id
 * @method describe :: Message pattern { cmd: 'describe' } -- Describe an Salesforce Object
 * @method describeGlobal :: Message pattern { cmd: 'describeGlobal' } -- Describe the Global Salesforce ENV
 * @method search :: Message pattern { cmd: 'search' } -- Execute SOSL Query
 */
@Controller()
export class QueryService {
    /**
     * @desc :: Initializes Salesforce connection with loginUrl = process.env.SF_URL and instanceURL = process.env.SF_ENV
     */
    constructor() {
        conn = new jsforce.Connection({loginUrl: process.env.SF_URL, instanceURL: process.env.SF_ENV});
    }

    /**
     * @desc :: Executes SOQL query based on given data. Auto fetches records up to 10000 results. Returns the resulting array.
     * @param q :: {action: 'some SOQL action', fields: 'an array of field names', table: 'Object to select from', clauses?: 'where conditions'}
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'soql_query' })
    query(q, respond){
        // Parse query
        var queryString = q.action;
        q.fields.forEach((f,i)=>{ queryString += " " + f + (i < q.fields.length - 1 ? "," : "") });

        queryString += " FROM " + q.table;
        if(q.clauses) queryString += " WHERE " + q.clauses;

        // Login into Salesforce
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err)

            // Execute query
            let records = new Array()
            conn.query(queryString)
            .on("record", (record) => { 
                delete record.attributes
                records.push(record) 
            })
            .on("end", () => {
                respond(null, records)
                conn.logout()
            })
            .on("error", (err) => {
                console.log("Error during Query: ", err)
                respond(err)
                conn.logout()
            })
            .run({ autoFetch: true, maxFetch: 10000})
        });
    }

    /**
     * @desc :: Retrieves records based on object and ids
     * @param data :: {object: 'Object to select from', ids: 'an array of SF ids'}
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'retrieve' })
    retrieve(data, respond){
        // Login to Salesforce
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err)

            // Retrieve records for given object and ids
            conn.sobject(data.object).retrieve(data.ids, (err, res)=> { 
                if(err) return respond(err)
                respond(null, res);
                conn.logout();
            });
        });
    }

    /**
     * @desc :: Creates records from given JSON objects.
     * @param data :: {object: 'Object to select from', records: 'an array of JSON objects'}
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'create' })
    create(data, respond){
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err)

            conn.sobject(data.object).create(data.records, (err, res)=> { 
                if(err) return respond(err)
                respond(null, res);
                conn.logout();
            });
        });
    }

    /**
     * @desc :: Update records based on object, ids, and given JSON objects
     * @param data :: {object: 'Object to select from', records: 'an array of JSON objects'}
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'update' })
    update(data, respond){
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err)

            conn.sobject(data.object).update(data.records, (err, res)=> { 
                if(err) return respond(err)
                respond(null, res);
                conn.logout();
            });
        });
    }

    /**
     * @desc :: Delete records based on object and ids
     * @param data :: {object: 'Object to select from', records: 'an array of SF ids'}
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'delete' })
    delete(data, respond){
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err)

            conn.sobject(data.object).delete(data.ids, (err, res)=> { 
                if(err) return respond(err)
                respond(null, res);
                conn.logout();
            });
        });
    }

    /**
     * @desc :: Upsert records based on object and external ids
     * @param data :: {object: 'Object to select from', records: 'an array of JSON objects'}
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'upsert' })
    upsert(data, respond){
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err)

            conn.sobject(data.object).upsert(data.records, (err, res)=> { 
                if(err) return respond(err)
                respond(null, res);
                conn.logout();
            });
        });
    }

    /**
     * @desc :: Describe Salesforce object based on object
     * @param data :: Object to describe
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'describe' })
    describe(object, respond){
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err);

            conn.sobject(object).describe((err, res)=> { 
                if(err) return respond(err);
                respond(null, res);
                conn.logout();
            });
        });
    }

    /**
     * @desc :: Describe global Salesforce environment
     * @param emt :: Ignored but need by NestJS
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'describeGlobal' })
    describeGlobal(emt, respond){
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err);

            conn.describeGlobal((err, res)=> { 
                if(err) return respond(err);
                respond(null, res);
                conn.logout();
            });
        });
    }

    /**
     * @desc :: Upsert records based on object and external ids
     * @param data :: {search: 'SOSL search string', objects: 'SOSL Retrive statement (i.e. Account(Id, Name), Contact(Id, Name))'}
     * @param respond :: Used by NestJS for their RPC functionality.
     */
    @MessagePattern({ cmd: 'search' })
    search(data, respond){
        conn.login(process.env.SF_USER, process.env.SF_PASS, (err, res)=>{ 
            if(err) return respond(err);

            conn.search(`FIND ${data.search} IN ALL FIELDS RETURNING ${data.objects}`, (err, res) =>{
                if(err) return respond(err)
                respond(null, res)
                conn.logout();
            })
        });
    }
}