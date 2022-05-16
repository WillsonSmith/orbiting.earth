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
    this._renderCanvas();
  }

  updated(changedProperties) {
    if (changedProperties.has(`renderer`)) {
      this._renderCanvas();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(`solar-system-body-added`, this.handleBodyAdded);
    this.addEventListener(`solar-system-body-changed`, this.handleBodyChanged);
    this.addEventListener(`solar-system-body-removed`, this.handleBodyRemoved);

    const resizeObserver = new ResizeObserver(() => {
      this._renderCanvas();
    });
    resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(`solar-system-body-added`, this.handleBodyAdded);
    this.removeEventListener(`solar-system-body-changed`, this.handleBodyChanged);
    this.removeEventListener(`solar-system-body-removed`, this.handleBodyRemoved);
  }

  render() {
    return html`
      ${this.renderer.engine === `canvas` ? html`<canvas></canvas>` : null}
      <slot></slot>
    `;
  }

  handleBodyAdded(event) {
    // const {name, position, radius, color, texture} = event.detail;
    this.renderer.addBody(event.detail);
    this._renderCanvas();
  }

  handleBodyChanged(event) {
    this.renderer.updateBody(event.detail);
    this._renderCanvas();
  }


  _handleResize() {
    this._renderCanvas();
  }

  _renderCanvas() {
    const canvas = this.shadowRoot.querySelector(`canvas`);
    if (!canvas) return;
    canvas.width = this.offsetWidth * window.devicePixelRatio;
    canvas.height = this.offsetHeight * window.devicePixelRatio;
    canvas.style.width = `${this.offsetWidth}px`;
    canvas.style.height = `${this.offsetHeight}px`;
    canvas && this.renderer.renderBodies({canvas});
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

  updateBody(body) {
    this._bodies.set(body.name, body);
    this.host.requestUpdate();
  }

  renderBodies() {
    if (this.engine === `canvas`) this.renderCanvas();
  }

  renderCanvas() {
    requestAnimationFrame(() => {
      if (!this.canvas) return;
      const ctx = this.canvas.getContext(`2d`);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (const body of this._bodies.values()) {
        let {name, position, radius, color} = body;
        
        if (body.orbits) {
          const orbitedBody = this._bodies.get(body.orbits);

          position = {
            x: orbitedBody.position.x + 0.1,
            y: orbitedBody.position.y + 0.05,
          };
        }
        
        const x = (position.x) * this.canvas.width / 2;
        const y = (position.y) * this.canvas.height / 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    });
  }

  _renderConnectedLog (engine, version) {
    return (`Renderrer • Connected`, {engine, version});
  }
}

customElements.define(`solar-system`, SolarSystem);
