import { Injectable, Module, bootstrap } from '../core/modularization';
import { DebugModule, Debug } from '../core/debug';


@Injectable()
class HomeController {
  constructor(public debug: Debug) {
    debug.log('Hello from HomeController!');
  }
}

@Module({
  imports: [ DebugModule ],
  singletons: [ HomeController ],
  factories: []
})
class TestModule {
  constructor(public debug: Debug) {
    debug.log('Hello World!')
  }
}

bootstrap(TestModule);
