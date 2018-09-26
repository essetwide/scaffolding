import { Controller } from './controller';

export abstract class Component extends Controller {
    abstract template: View | Function;
    abstract state: Model;
    
    abstract async render()

    async setState(newState) {
        this.state = { ...this.state, ...newState };
        await this.render();
    }
}

export abstract class View {
    abstract compile(state: Model): string;
}

export class Model {}