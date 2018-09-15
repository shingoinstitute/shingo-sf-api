#!/usr/bin/env node
import { SalesforceMicroservice } from './microservices/salesforce.microservice'
import * as grpc from 'grpc'
import { loggerFactory } from './logger.service'

const globalLogger = loggerFactory()

if (
  !(
    process.env.SF_ENV &&
    process.env.SF_URL &&
    process.env.SF_USER &&
    process.env.SF_PASS
  )
) {
  globalLogger.error('Missing environment variables')
  process.exit(1)
}

const microservice = new SalesforceMicroservice(process.env as any)
const port = process.env.PORT || 8888

const server = new grpc.Server({
  'grpc.max_send_message_length': 1024 * 1024 * 1024,
  'grpc.max_receive_message_length': 1024 * 1024 * 1024,
})

server.addService(microservice.service, microservice)

server.bind(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure())
server.start()
globalLogger.info(`SalesforceMicroservice is listening on port ${port}.`)
