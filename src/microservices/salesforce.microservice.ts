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
            .catch(error => {
                SalesforceService.log.error('Error in query(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }

    retrieve(call, callback){
        SalesforceService.retrieve(call.request)
            .then(record => callback(null, record))
            .catch(error => {
                SalesforceService.log.error('Error in retrieve(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }

    create(call, callback){
        SalesforceService.create(call.request)
            .then(record => callback(null, record))
            .catch(error => {
                SalesforceService.log.error('Error in create(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }

    update(call, callback){
        SalesforceService.update(call.request)
            .then(record => callback(null, record))
            .catch(error => {
                SalesforceService.log.error('Error in update(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }

    delete(call, callback){
        SalesforceService.delete(call.request)
            .then(record => callback(null, record))
            .catch(error => {
                SalesforceService.log.error('Error in delete(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }

    upsert(call, callback){
        SalesforceService.upsert(call.request)
            .then(record => callback(null, record))
            .catch(error => {
                SalesforceService.log.error('Error in upsert(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }

    describe(call, callback){
        SalesforceService.describe(call.request.object)
            .then(record => callback(null, record))
            .catch(error => {
                SalesforceService.log.error('Error in describe(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }

    search(call, callback){
        SalesforceService.search(call.request)
            .then(record => callback(null, record))
            .catch(error => {
                SalesforceService.log.error('Returning error from search(): %j', error);
                const metadata = new grpc.Metadata();
                metadata.add('error-bin', Buffer.from(JSON.stringify(error)));
                callback({
                    code: grpc.status.INTERNAL,
                    details: error.name,
                    metadata: metadata
                });
            });
    }
}