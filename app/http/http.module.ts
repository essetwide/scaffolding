import { Module } from '../../core/modularization';
import { Http } from './http';

@Module({
    factories: [],
    singletons: [ Http ],
    imports: []
})
export class HttpModule {
    
}