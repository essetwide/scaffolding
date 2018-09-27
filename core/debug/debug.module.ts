import {Module} from '../modularization';
import {Debug} from './debug';

@Module({
  imports: [],
  singletons: [],
  factories: [Debug]
})
export class DebugModule {

}
