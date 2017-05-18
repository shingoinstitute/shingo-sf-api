import { Module } from 'nest.js';
import { SalesforceService } from './salesforce.service';
import 'rxjs';

@Module({
    controllers: [ SalesforceService ]
})
export class ApplicationModule {}