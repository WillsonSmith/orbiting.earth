import {LitElement, html, css} from 'lit';
import './components/solar-system-body/solar-system-body.js';

class SolarSystem extends LitElement {
  static get properties() {
    return {
      renderer: { type: Object },
    };
  }

  constructor() {
    super();
    this.renderer = renderer({engine: `canvas`, version: `v0.5`});
  }

  static get styles() {
    return css``;
  }

  render() {
    html`<div>Hello</div>`;
  }
}

function renderer({engine, version}) {
  console.log(`renderer: ${engine} ${version}`);
}

customElements.define(`solar-system`, SolarSystem);