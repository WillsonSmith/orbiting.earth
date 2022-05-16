import {LitElement, html, css} from 'lit';
import '../../../../shared/web-components/solar-system/solar-system.js';

class OrbitingEarth extends LitElement {
  static get properties() {
    return {
      moonPosition: {type: Object},
      earthPosition: {type: Object},
      playing: {type: Boolean, attribute: true},
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
    this.animationLoop = () => {
      if (!this.playing) return;
      const moonAngle = (Date.now() / 1000) * 0.1;
      this.moonPosition = {
        x: 0.7 + 0.1 * Math.cos(moonAngle),
        y: 0.5 + 0.1 * Math.sin(moonAngle),
      };
      requestAnimationFrame(this.animationLoop);
    };
    this.animationLoop();
  }

  updated(changedProperties) {
    if (changedProperties.has(`playing`)) {
      console.log(`playing`);
      
    }
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
          x-position=${this.moonPosition.x}
          y-position=${this.moonPosition.y}
          radius="10"
          color="rgb(255, 255, 255)"
          texture="/static/moon.jpg"
          > Moon • Position: 0 0 1</solar-system-body>
      </solar-system>
    `;
  }
}

customElements.define(`orbiting-earth`, OrbitingEarth);