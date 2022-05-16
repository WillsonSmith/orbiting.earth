import {LitElement, html, css} from 'lit';
import '../../../../shared/web-components/solar-system/solar-system.js';

class OrbitingEarth extends LitElement {
  static get styles() {
    return css`
      solar-system {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }
  render() {
    return html`
    <solar-system>
        <solar-system-body
          name="sun"
          x-position="0"
          y-position="0.5"
          radius="100"
          color="rgb(219, 169, 44)"
        ></solar-system-body>
        <solar-system-body
          name="earth"
          x-position="0.7"
          y-position="0.5"
          radius="40"
          color="rgb(45, 120, 190)"
          texture="/static/earth.jpg"
        > Earth • Position: 0 0 0 •</solar-system-body>
        <solar-system-body
          name="moon"
          orbits="earth"
          orbit-radius="10"
          x-position="0.75"
          y-position="0.55"
          radius="10"
          color="rgb(255, 255, 255)"
          texture="/static/moon.jpg"
          > Moon • Position: 0 0 1</solar-system-body>
      </solar-system>
    `;
  }
}

customElements.define(`orbiting-earth`, OrbitingEarth);