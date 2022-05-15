import {LitElement, html, css} from 'lit';

import {styleVisuallyHidden} from '../../../sharedStyles/styleVisuallyHidden.js';

class SolarSystemBody extends LitElement {
  static get properties() {
    return {
      name: {type: String},
      position: {type: Object},
      size: {type: Object},
      color: {type: Object},
      texture: {type: Object},
    };
  }

  static get styles() {
    return css`
      ${styleVisuallyHidden}
    `;
  }

  disconnectedCallback() {
    console.log(`disconnect`);
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
        name: this.name,
        position: this.position,
        size: this.size,
        color: this.color,
        texture: this.texture,
      },
      bubbles: true,
    });
    this.dispatchEvent(bodyAddedEvent);
  }
}

customElements.define(`solar-system-body`, SolarSystemBody);