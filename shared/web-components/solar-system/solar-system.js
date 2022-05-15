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
    return css`
      canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }

  constructor() {
    super();
    this.renderer = new RenderController(this, {engine: `canvas`, version: `v0.5`});
  }

  firstUpdated() {
    const canvas = this.shadowRoot.querySelector(`canvas`);
    this.renderer.canvas = canvas;

    canvas && this.renderer.renderBodies({canvas});
    console.log(this.offsetHeight, this.offsetWidth);
    canvas.width = this.offsetWidth * window.devicePixelRatio;
    canvas.height = this.offsetHeight * window.devicePixelRatio;
    canvas.style.width = `${this.offsetWidth}px`;
    canvas.style.height = `${this.offsetHeight}px`;
  }

  updated(changedProperties) {
    if (changedProperties.has(`renderer`)) {
      const canvas = this.shadowRoot.querySelector(`canvas`);
      canvas && this.renderer.renderBodies({canvas});
    }
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
      ${this.renderer.engine === `canvas` ? html`<canvas></canvas>` : null}
      <slot></slot>
    `;
  }

  handleBodyAdded(event) {
    const {name, position, radius, color, texture} = event.detail;
    this.renderer.addBody({
      name,
      position,
      radius,
      color,
      texture,
    });
  }
}

class RenderController {
  constructor(host, {engine, version, canvas}) {
    this.engine = engine;
    this.version = version;
    this._bodies = new Map();
    (this.host = host).addController(this);
  }

  hostConnected() {
    console.log(this._renderConnectedLog(this.engine, this.version));

    console.log(this.canvas);
  }
  hostDisconnected() {
    console.log(`Host • disconnected`);
  }

  addBody(body) {
    this._bodies.set(body.name, body);
    this.host.requestUpdate();
  }

  removeBody(body) {
    this._bodies.delete(body.name);
    this.host.requestUpdate();
  }

  renderBodies() {
    if (this.engine === `canvas`) this.renderCanvas();
  }

  renderCanvas() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext(`2d`);
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const body of this._bodies.values()) {
      const {position, radius, color} = body;
      const x = (position.x) * this.canvas.width / 2;
      const y = (position.y) * this.canvas.height / 2;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }

  }

  _renderConnectedLog (engine, version) {
    return (`Renderrer • Connected`, {engine, version});
  }
}

customElements.define(`solar-system`, SolarSystem);
