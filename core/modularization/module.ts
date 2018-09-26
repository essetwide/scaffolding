import { Container } from './container';

interface ModuleOptions {
  name?: string;
  imports: Array<Function>;
  singletons: Array<Function>;
  factories: Array<Function>;
}

export function Module(options: ModuleOptions): ClassDecorator {
  return function moduleDecorator<T>(Class): any {
    return class extends ModuleContainer {
      constructor() {
        super();
        this.name = options.name || Class.name;

        const importedDeclarations = new Map<string, any>();
        options.imports.forEach(M => {
          // @ts-ignore
          new M().container.declarations.forEach((val, key) => {
            importedDeclarations.set(key, val);
          });
        });
        this.container = new Container(this, importedDeclarations);

        options.singletons.forEach(s => this.addSingleton(s));
        options.factories.forEach(f => this.addFactory(f));

        const dependencies = Reflect.getMetadata('design:paramtypes', Class);
        if (dependencies)
          new (Class.bind(this, ...dependencies.map(d => this.container.resolve('Main', d.name))));
      }
    }
  };
}


export class ModuleContainer {
  name: string;
  container: Container;

  addSingleton(Singleton: Function) {
    const dependencies = Reflect.getMetadata('design:paramtypes', Singleton);
    this.container.declareSingleton(Singleton.name, Singleton, dependencies);
  }

  addFactory(Factory: Function) {
    const dependencies = Reflect.getMetadata('design:paramtypes', Factory);
    this.container.declareFactory(Factory.name, Factory, dependencies);
  }
}

export function Injectable(): ClassDecorator {
  return function moduleDecorator<T>(constructor): T {
    return constructor;
  }
}
