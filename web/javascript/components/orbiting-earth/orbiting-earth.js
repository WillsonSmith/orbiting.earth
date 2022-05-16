import {LitElement, html, css} from 'lit';
import '../../../../shared/web-components/solar-system/solar-system.js';

class OrbitingEarth extends LitElement {
  static get properties() {
    return {
      sunPosition: {type: Object},
      moonPosition: {type: Object},
      earthPosition: {type: Object},
      playing: {type: Boolean, attribute: true, reflect: true},
    };
  }
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

  constructor() {
    super();
    this.playing = true;
    this.moonPosition = {x: 0.55, y: 0.55};
    this.earthPosition = {x: 0.7, y: 0.5};
    this.sunPosition = {x: 0.5, y: 0.5};
  }

  firstUpdated() {
    this.animationLoop = () => {
      if (this.playing) {
        const earthAngle = (Date.now() / 1000) * ((Math.PI * 2) / 60);
        this.earthPosition = {
          x: this.sunPosition.x + 0.2 * Math.cos(earthAngle),
          y: this.sunPosition.y + 0.2 * Math.sin(earthAngle),
        };
        const moonAngle = earthAngle * 12;
        this.moonPosition = {
          x: this.earthPosition.x + 0.05 * Math.cos(moonAngle),
          y: this.earthPosition.y + 0.05 * Math.sin(moonAngle),
        };
      };
      requestAnimationFrame(this.animationLoop);
    };
    requestAnimationFrame(this.animationLoop);
  }

  render() {
    return html`
    <solar-system>
        <solar-system-body
          name="sun"
          x-position=${this.sunPosition.x}
          y-position=${this.sunPosition.y}
          radius="100"
          color="rgb(219, 169, 44)"
        > Sun • Position: 0 0.5 </solar-system-body>
        <solar-system-body
          name="earth"
          x-position=${this.earthPosition.x}
          y-position=${this.earthPosition.y}
          radius="40"
          color="rgb(45, 120, 190)"
        > Earth • Position: 0.7 0.5 </solar-system-body>
        <solar-system-body
          name="moon"
          orbits="earth"
          orbit-radius="10"
          x-position=${this.moonPosition.x}
          y-position=${this.moonPosition.y}
          radius="10"
          color="rgb(255, 255, 255)"
          > Moon • Position: 0.55 0.55 </solar-system-body>
      </solar-system>
    `;
  }
}

customElements.define(`orbiting-earth`, OrbitingEarth);