import {LitElement, html, css} from 'lit';

import {styleVisuallyHidden} from '../../../sharedStyles/styleVisuallyHidden.js';

class SolarSystemBody extends LitElement {
  static get properties() {
    return {
      name: {type: String},
      x: {type: Number, attribute: `x-position`},
      y: {type: Number, attribute: `y-position`},
      radius: {type: Number},
      color: {type: String},
      texture: {type: String},
    };
  }

  static get styles() {
    return css`
      ${styleVisuallyHidden}
    `;
  }

  disconnectedCallback() {
    this._dispatchEvent(`solar-system-body-removed`);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="visually-hidden">
        <slot></slot>
      </div>
    `;
  }

  firstUpdated() {
    this._dispatchEvent(`solar-system-body-added`);
  }

  updated() {
    this._dispatchEvent(`solar-system-body-changed`);
  }

  _dispatchEvent(eventName) {
    const bodyAddedEvent = new CustomEvent(eventName, {
      detail: {
        color: this.color,
        name: this.name,
        position: {x: this.x, y: this.y},
        radius: this.radius,
        texture: this.texture,
        element: this,
      },
      bubbles: true,
    });
    this.dispatchEvent(bodyAddedEvent);
  }
}

customElements.define(`solar-system-body`, SolarSystemBody);