import {Injectable, Module, bootstrap} from '../core/modularization';
import {DebugModule, Debug} from '../core/debug';


@Injectable()
class HomeController {
  constructor(public debug: Debug) {
    console.log(debug.scope, 'Hello from HomeController!');
  }
}

@Module({
  imports: [DebugModule],
  singletons: [HomeController],
  factories: [],
  bootstrap: [HomeController]
})
class TestModule {
  constructor(public debug: Debug) {
    console.log(debug.scope, 'Hello World!')
  }
}

bootstrap(TestModule);
