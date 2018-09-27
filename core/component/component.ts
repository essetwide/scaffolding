export abstract class Component {
  abstract template?: View | Function;
  abstract state: Model;

  abstract async update()

  async setState(newState) {
    this.state = {...this.state, ...newState};
    await this.update();
  }
}

export abstract class View {
  abstract compile(state: Model): string;
}

export class Model {
}
