import {LitElement, html, css} from 'lit';
import './components/solar-system-body/solar-system-body.js';

import {RenderController} from './RenderController.js';
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
    this.context = this.canvas.getContext(`2d`);
    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.renderer.canvas = this.canvas;
    this.renderer.context = this.context;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener(`solar-system-body-added`, this.handleBodyAdded);
    this.addEventListener(`solar-system-body-changed`, this.handleBodyChanged);

    const resizeObserver = new ResizeObserver(() => {
      this.renderer.renderBodies({resize: true});
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
  }

  handleBodyRemoved(name) {
    this.renderer.removeBody(name);
  }

  handleBodyChanged(event) {
    this.renderer.updateBody(event.detail);
  }
}

customElements.define(`solar-system`, SolarSystem);
