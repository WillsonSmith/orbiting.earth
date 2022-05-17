import {LitElement, html, css} from 'lit';
import '../../../../shared/web-components/solar-system/solar-system.js';

class OrbitingEarth extends LitElement {
  static get properties() {
    return {
      playing: {type: Boolean, attribute: true, reflect: true},
      systemSize: {type: Object},
      bodies: {type: Array},
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

    const orbitRate = (Math.PI * 2) / 60;

    this.bodies = [
      {
        name: `sun`,
        position: {x: 0.5, y: 0.5},
        radius: 100,
        color: `rgb(219, 169, 44)`,
      },
      {
        name: `earth`,
        orbits: `sun`,
        orbitDistance: 100,
        orbitRate: orbitRate,
        position: {x: 0.7, y: 0.5},
        radius: 40,
        color: `rgb(45, 120, 190)`,
      },
      {
        name: `moon`,
        orbits: `earth`,
        orbitDistance: 10,
        orbitRate: orbitRate * 12,
        position: {x: 0.55, y: 0.55},
        radius: 10,
        color: `rgb(255, 255, 255)`,
      }
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver(() => {
      const system = this.shadowRoot.querySelector(`solar-system`);
      this.systemSize = {width: system.offsetWidth, height: system.offsetHeight};
    });
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.disconnect();
  }

  firstUpdated() {
    const system = this.shadowRoot.querySelector(`solar-system`);
    this.systemSize = {width: system.offsetWidth, height: system.offsetHeight};
    this.animationLoop = () => {
      if (this.playing) {
        const oW = this.systemSize.width;
        const oH = this.systemSize.height;

        const now = Date.now() / 1000;
        for (const body of this.bodies) {
          const angle = now * body.orbitRate;
          let position = {x: body.position.x, y: body.position.y};
          if (body.orbits) {
            const orbitedBody = this.bodies.find(b => b.name === body.orbits);
            const bodyPixelPosition = {
              x: (orbitedBody.position.x * oW) + orbitedBody.radius + body.orbitDistance,
              y: (orbitedBody.position.y * oH) + orbitedBody.radius + body.orbitDistance,
            };
            const offset = {
              x: (bodyPixelPosition.x / oW) - orbitedBody.position.x,
              y: (bodyPixelPosition.y / oH) - orbitedBody.position.y,
            };
            
            position.x = orbitedBody.position.x + offset.x * Math.cos(angle);
            position.y = orbitedBody.position.y + offset.y * Math.sin(angle);
            
          }
          body.position = position;
        }
        this.bodies = [...this.bodies];
      };
      requestAnimationFrame(this.animationLoop);
    };
    requestAnimationFrame(this.animationLoop);
  }

  render() {
    return html`
    <solar-system>
      ${this.bodies.map(body => html`
        <solar-system-body
          name="${body.name}"
          x-position="${body.position.x}"
          y-position="${body.position.y}"
          radius="${body.radius}"
          color="${body.color}"
        ></solar-system-body>
      `)}
      </solar-system>
    `;
  }
}

customElements.define(`orbiting-earth`, OrbitingEarth);