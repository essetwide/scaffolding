import 'reflect-metadata';

export class Declaration {
  public instance = null;

  constructor(public Class: Function,
              public dependencies: Array<Function>,
              public type: 'SINGLETON' | 'FACTORY' = 'SINGLETON') {
  }
}

export class Context {
  constructor(public readonly moduleName: string,
              public readonly name: string) {
  }
}

export class Container {
  declarations = new Map<string, Declaration>();
  private readonly moduleName: string;

  constructor(moduleName: string, declarations?: Map<string, Declaration>) {
    this.moduleName = moduleName;

    if (declarations)
      this.declarations = declarations;

    this.declarations.set('Context', new Declaration(Context, [], 'FACTORY'));
  }

  declare(name: string, dependencies: Array<Function>, Class: Function) {
    const resolvedDependencies = this.resolveDependencies(name, dependencies);
    this.declarations.set(name, new Declaration(Class.bind(this, ...resolvedDependencies), dependencies));
  }

  declareFactory(name: string, dependencies: Array<Function>, Class: Function) {
    this.declarations.set(name, new Declaration(Class, dependencies, 'FACTORY'));
  }

  resolve(requesterName: string, dependencyName: string) {
    const declaration = this.declarations.get(dependencyName);

    if (!declaration.instance) {

      if (declaration.Class.name === 'Context') {
        return new (declaration.Class.bind(this, this.moduleName, requesterName));
      } else {
        if (declaration.type === 'SINGLETON') {

          const instance = new (declaration.Class.bind(this));
          declaration.instance = instance;
          this.declarations.set(dependencyName, declaration);

          return instance;
        } else {

          const resolvedDependencies = this.resolveDependencies(requesterName, declaration.dependencies);
          return new (declaration.Class.bind(this, ...resolvedDependencies));
        }
      }
    } else {
      return declaration.instance;
    }
  }

  resolveDependencies(requester: string, dependencies: Array<Function>): Array<any> {
    if (dependencies) {
      return dependencies.map(d => this.resolve(requester, d.name));
    }
    return [];
  }
}
