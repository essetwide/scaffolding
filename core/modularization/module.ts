import { Container } from './container';

interface ModuleOptions {
  name?: string;
  imports: Array<Function>;
  singletons: Array<Function>;
  factories: Array<Function>;
  bootstrap?: Array<Function>;
}

export function Module(options: ModuleOptions): ClassDecorator {
  return function moduleDecorator<T>(Class): any {
    return class extends ModuleContainer {
      constructor() {
        super();
        this.name = options.name || Class.name;

        const importedDeclarations = new Map<string, any>();
        
        options.imports.forEach(ModuleDeclaration => {
            (new (ModuleDeclaration.bind(this))).container.declarations
            .forEach((val, key) => {
              importedDeclarations.set(key, val);
            });
        });

        this.container = new Container(this.name, importedDeclarations);

        options.singletons.forEach(declaration => this.addSingleton(declaration));
        options.factories.forEach(declaration => this.addFactory(declaration));

        const dependencies = Reflect.getMetadata('design:paramtypes', Class);
        if (dependencies) {
          const resolvedDependencies = dependencies.map(d => this.container.resolve('Main', d.name));
          new (Class.bind(this, ...resolvedDependencies));
        }
        
        if (options.bootstrap)
          options.bootstrap.forEach(b => {
            this.container.resolve('Main', b.name);
          });
      }
    }
  };
}

export class ModuleContainer {
  name: string;
  container: Container;

  addSingleton(Singleton: Function) {
    const dependencies = Reflect.getMetadata('design:paramtypes', Singleton);
    this.container.declare(Singleton.name, dependencies, Singleton);
  }

  addFactory(Factory: Function) {
    const dependencies = Reflect.getMetadata('design:paramtypes', Factory);
    this.container.declareFactory(Factory.name, dependencies, Factory);
  }
}

export function Injectable(): ClassDecorator {
  return function moduleDecorator<T>(constructor): T {
    return constructor;
  }
}
