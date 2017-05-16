import { Module } from 'nest.js';
import 'rxjs';
import { QueryService } from './query.service';

@Module({
    controllers: [ QueryService ]
})
export class ApplicationModule {}