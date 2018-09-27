import {Injectable, Module, bootstrap, OnInit} from '../core/modularization';
import {DebugModule, Debug} from '../core/debug';


@Injectable()
class HomeController implements OnInit {
  constructor(public debug: Debug) {
    this.debug.log('Hello from HomeController!');
  }

  onInit() {
    console.log('HOME INIT')
  }
}

@Module({
  imports: [DebugModule],
  singletons: [HomeController],
  factories: [],
  bootstrap: [HomeController]
})
class TestModule implements OnInit {
  constructor(public debug: Debug) {
    this.debug.log('Hello World!')
  }

  onInit() {
    console.log('MODULE INIT')
  }
}

bootstrap(TestModule);
