import { Component } from '../../core/component/component';

export abstract class HTMLComponent extends Component {
    constructor(private element: HTMLElement) {
        super();
    }
    
    render(): Promise<any> {
        const renderReq = new Promise(function (resolve) {
            const reqId = window.requestAnimationFrame((resTime) => {
                this.element.innerHTML = this.template instanceof Function ?
                    this.template(this.state) :
                    this.template.compile(this.state);
                resolve();
            });
        });
        
        return renderReq;
    }
}