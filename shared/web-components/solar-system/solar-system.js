import {LitElement, html, css} from 'lit';
import './components/solar-system-body/solar-system-body.js';

import {RenderController} from './renderController.js';
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
    this.canvas = this.shadowRoot.querySelector(`canvas`);
    this.renderer.canvas = this.canvas;

    this._resizeCanvas();
    this._renderCanvas();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(`solar-system-body-added`, this.handleBodyAdded);
    this.addEventListener(`solar-system-body-changed`, this.handleBodyChanged);

    const resizeObserver = new ResizeObserver(() => {
      this._resizeCanvas();
      this._renderCanvas();
    });
    resizeObserver.observe(this);

    const mutationObserver = new MutationObserver((mutations) => {
      const mutation = mutations[0];
      if (mutation.removedNodes) {
        for (const removedNode of mutation.removedNodes) {
          if (removedNode.nodeName === `SOLAR-SYSTEM-BODY`) {
            this.handleBodyRemoved(removedNode.name);
          }
        }
      }
    });
    mutationObserver.observe(this, {
      childList: true,
      subtree: false
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(`solar-system-body-added`, this.handleBodyAdded);
    this.removeEventListener(`solar-system-body-changed`, this.handleBodyChanged);
  }

  render() {
    return html`
      ${this.renderer.engine === `canvas` ? html`<canvas></canvas>` : null}
      <slot></slot>
    `;
  }

  handleBodyAdded(event) {
    this.renderer.addBody(event.detail);
    this._renderCanvas();
  }

  handleBodyRemoved(name) {
    this.renderer.removeBody(name);
    this._renderCanvas();
  }

  handleBodyChanged(event) {
    this.renderer.updateBody(event.detail);
    this._resizeCanvas();
    this._renderCanvas();
  }


  _handleResize() {
    this._renderCanvas();
  }

  _renderCanvas() {
    const canvas = this.shadowRoot.querySelector(`canvas`);
    canvas && this.renderer.renderBodies();
  }

  _resizeCanvas() {
    this.canvas.width = this.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.offsetHeight * window.devicePixelRatio;
    this.canvas.style.width = `${this.offsetWidth}px`;
    this.canvas.style.height = `${this.offsetHeight}px`;
  }
}

customElements.define(`solar-system`, SolarSystem);
