import * as grpc from 'grpc';
import * as path from 'path';
import { SalesforceService } from '../shared/salesforce.service';

export class SalesforceMicroservice {

    public sfServices;

    constructor(protoPath? : string) {
        if(protoPath === undefined) protoPath = path.join(__dirname, '../proto/sf_services.proto');
        this.sfServices = grpc.load(protoPath).sfservices;
    }

    query(call, callback){
        SalesforceService.query(call.request)
            .then(records => callback(null, records))
            .catch(error => callback(error));
    }

    retrieve(call, callback){
        SalesforceService.retrieve(call.request)
            .then(record => callback(null, record))
            .catch(error => callback(error));
    }

    create(call, callback){
        SalesforceService.create(call.request)
            .then(record => callback(null, record))
            .catch(error => callback(error));
    }

    update(call, callback){
        SalesforceService.update(call.request)
            .then(record => callback(null, record))
            .catch(error => callback(error));
    }

    delete(call, callback){
        SalesforceService.delete(call.request)
            .then(record => callback(null, record))
            .catch(error => callback(error));
    }

    upsert(call, callback){
        SalesforceService.upsert(call.request)
            .then(record => callback(null, record))
            .catch(error => callback(error));
    }

    describe(call, callback){
        SalesforceService.describe(call.request.object)
            .then(record => callback(null, record))
            .catch(error => callback(error));
    }

    search(call, callback){
        SalesforceService.search(call.request)
            .then(record => callback(null, record))
            .catch(error => callback(error));
    }
}