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
    this.renderer = renderer({engine: `canvas`, version: `v0.5`});
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
    this.renderer.add({
      name,
      position,
      size,
      color,
      texture,
    });
  }
  handleBodyRemoved(event) {
    const {name} = event.detail;
    this.renderer.remove(name);
  }

}

function renderer({engine, version}) {
  console.log(`renderer: ${engine} ${version}`);
  const bodies = {};
  return {
    add(body) {
      bodies[body.name] = body;
      console.log(`renderer: add ${body.name}`);
    },
    remove(name) {
      bodies[name] = null;
      delete bodies[name];
      console.log(`renderer: remove ${name}`);
    }
  };
}

customElements.define(`solar-system`, SolarSystem);