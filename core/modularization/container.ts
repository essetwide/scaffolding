import 'reflect-metadata';
import { ModuleContainer } from './module';

export class Context {
  module: ModuleContainer;
  name: string;
}

export class Container {
  declarations = new Map<string, any>();
  private readonly module: ModuleContainer;

  constructor(module: ModuleContainer, declarations) {
    this.module = module;

    if (declarations)
      this.declarations = declarations;

    const DependencyContext = class extends Context {
      constructor() {
        super();
        this.module = module;
      }
    };

    this.declareFactory('Context', DependencyContext, []);
  }

  declareSingleton(name: string, Class: Function, dependencies: Array<Function>) {
    const resolvedDependencies = dependencies.map(d => this.resolve(name, d.name));

    resolvedDependencies.forEach(r => {
      if (r instanceof Context) {
        r.module = this.module;
        r.name = name;
      }
    });

    // @ts-ignore
    const instance = new Class(...resolvedDependencies);
    this.declarations.set(name, instance);
  }

  declareFactory(name: string, Class: Function, dependencies: Array<Function>) {
    const resolvedDependencies = dependencies.map(d => this.resolve(name, d.name));
    this.declarations.set(name, { Factory: Class, resolvedDependencies, isFactory: true })
  }

  resolve(requesterName: string, dependencyName: string) {
    const declaration = this.declarations.get(dependencyName);

    if (declaration.isFactory) {
      declaration.resolvedDependencies.forEach(r => {
        if (r instanceof Context) {
          r.module = this.module;
          r.name = requesterName;
        }
      });
      const factoryInstance = new declaration.Factory(...declaration.resolvedDependencies);

      return factoryInstance;
    } else {
      return declaration;
    }
  }
}
