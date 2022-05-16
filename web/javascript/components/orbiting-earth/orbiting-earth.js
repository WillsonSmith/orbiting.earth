import {LitElement, html, css} from 'lit';
import '../../../../shared/web-components/solar-system/solar-system.js';

class OrbitingEarth extends LitElement {
  static get properties() {
    return {
      sunPosition: {type: Object},
      moonPosition: {type: Object},
      earthPosition: {type: Object},
      playing: {type: Boolean, attribute: true, reflect: true},
      width: {type: Number},
      height: {type: Number},
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
        const oW = this.offsetWidth;
        const oH = this.offsetHeight;

        const earthPositionInPixels = {
          x: this.sunPosition.x * oW + 50 + 20 + 50,
          y: this.sunPosition.y * oH + 50 + 20 + 50
        };

        const earthOffset = {
          x: (earthPositionInPixels.x / oW) - this.sunPosition.x,
          y: (earthPositionInPixels.y / oH) - this.sunPosition.y
        };

        const earthAngle = (Date.now() / 1000) * ((Math.PI * 2) / 60);
        this.earthPosition = {
          x: this.sunPosition.x + earthOffset.x * Math.cos(earthAngle),
          y: this.sunPosition.y + earthOffset.y * Math.sin(earthAngle),
        };


        const moonPositionInPixels = {
          x: this.earthPosition.x * oW + 20 + 10,
          y: this.earthPosition.y * oH + 20 + 10
        };

        const moonOffset = {
          x: (moonPositionInPixels.x / oW) - this.earthPosition.x,
          y: (moonPositionInPixels.y / oH) - this.earthPosition.y
        };

        const moonAngle = earthAngle * 12;
        this.moonPosition = {
          x: this.earthPosition.x + moonOffset.x * Math.cos(moonAngle),
          y: this.earthPosition.y + moonOffset.y * Math.sin(moonAngle),
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