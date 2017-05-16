import { NestFactory, Transport } from 'nest.js';
import { ApplicationModule } from './app.module';

const transport = Transport.REDIS;
const url = process.env.REDIS_URL || 'redis://shingo-redis:6379'
const port = process.env.PORT || 3000

const app = NestFactory.createMicroservice(ApplicationModule, { transport, url, port });
app.listen(() => console.log(`Salesforce API microservice is listening on port ${port}`));