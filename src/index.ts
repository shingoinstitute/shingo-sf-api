import { SalesforceMicroservice } from './microservices/salesforce.microservice';
import * as grpc from 'grpc';

const microservice = new SalesforceMicroservice();
const port = process.env.PORT || 8888;

let server = new grpc.Server({ 'grpc.max_send_message_length': 1000 * 1000 * 30, 'grpc.max_receive_message_length': 1000 * 1000 * 30 });
server.addService(microservice.sfServices.SalesforceMicroservices.service, {
    query: microservice.query,
    retrieve: microservice.retrieve,
    create: microservice.create,
    update: microservice.update,
    delete: microservice.delete,
    upsert: microservice.upsert,
    describe: microservice.describe,
    search: microservice.search
});

server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure());
server.start();
console.log(`SalesforceMicroservice is listening on port ${port}.`)