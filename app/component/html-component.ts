import {Component} from '../../core/component';

export abstract class HTMLComponent extends Component {
  constructor(private host: HTMLElement) {
    super();
  }

  update(): Promise<any> {
    const renderReq = new Promise(function (resolve) {
      const reqId = window.requestAnimationFrame((resTime) => {
        this.host.innerHTML = this.template instanceof Function ?
          this.template(this.state) :
          this.template.compile(this.state);
        resolve();
      });
    });

    return renderReq;
  }
}
