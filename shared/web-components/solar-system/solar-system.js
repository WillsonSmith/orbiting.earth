import {LitElement, html, css} from 'lit';
import './components/solar-system-body/solar-system-body.js';

class SolarSystem extends LitElement {
  static get properties() {
    return {
      bodies: {type: Array},
      renderer: { type: Object },
    };
  }
  static get styles() {
    return css``;
  }

  constructor() {
    super();
    this.renderer = new RenderController(this, {engine: `canvas`, version: `v0.5`});
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(`solar-system-body-added`, this.handleBodyAdded);
    this.addEventListener(`solar-system-body-removed`, this.handleBodyRemoved);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(`solar-system-body-added`, this.handleBodyAdded);
    this.removeEventListener(`solar-system-body-removed`, this.handleBodyRemoved);
  }

  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }

  handleBodyAdded(event) {
    const {name, position, size, color, texture} = event.detail;
    this.renderer.addBody({
      name,
      position,
      size,
      color,
      texture,
    });
  }

}



class RenderController {
  constructor(host, {engine, version}) {
    (this.host = host).addController(this);
    this._bodies = new Map();
    this.engine = engine;
    this.version = version;
  }

  hostConnected() {
    console.log(this._renderConnectedLog(this.engine, this.version));
  }
  hostDisconnected() {
    console.log(`Host • disconnected`);
  }

  addBody(body) {
    this._bodies.set(body.name, body);
    this.renderBodies();
  }

  removeBody(body) {
    this._bodies.delete(body.name);
    this.renderBodies();
  }

  renderBodies() {
    if (this.engine === `canvas`) {
      this.renderCanvas();
    }
  }

  renderCanvas() {
    console.log(`Renderrer • Rendering canvas`);
  }

  _renderConnectedLog (engine, version) {
    return (`Renderrer • Connected`, {engine, version});
  }
}

customElements.define(`solar-system`, SolarSystem);
