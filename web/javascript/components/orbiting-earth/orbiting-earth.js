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

    const earthRadius = 40;
    const earthDistanceToSun = 100;

    this.bodies = [
      {
        name: `sun`,
        position: {x: 0.5, y: 0.5},
        radius: 100,
        color: `rgb(219, 169, 44)`,
      },
      {
        name: `mercury`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun * 0.445,
        daysToOrbit: 88,
        position: {x: 0, y: 0},
        radius: earthRadius * 0.38,
        color: `grey`,
      },
      {
        name: `venus`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun * 0.723,
        daysToOrbit: 255,
        position: {x: 0, y: 0},
        radius: earthRadius * 0.9,
        color: `lightgrey`,
      },
      {
        name: `earth`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun,
        daysToOrbit: 365,
        position: {x: 0.7, y: 0.5},
        radius: earthRadius,
        color: `rgb(45, 120, 190)`,
      },
      {
        name: `moon`,
        orbits: `earth`,
        orbitDistance: earthRadius * 0.2,
        daysToOrbit: 365 / 12,
        position: {x: 0.55, y: 0.55},
        radius: earthRadius * 0.25,
        color: `rgb(255, 255, 255)`,
      },
      {
        name: `mars`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun * 1.52,
        daysToOrbit: 687,
        position: {x: 0, y: 0},
        radius: earthRadius * 0.5,
        color: `orangered`,
      },
      {
        name: `jupiter`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun * 11.2,
        daysToOrbit: 4331,
        position: {x: 0, y: 0},
        radius: earthRadius * 11,
        color: `orange`,
      },
      {
        name: `saturn`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun * 9.5,
        daysToOrbit: 10759,
        position: {x: 0, y: 0},
        radius: earthRadius * 1.5,
        color: `orangeyellow`,
      },
      {
        name: `uranus`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun * 19,
        daysToOrbit: 30685,
        position: {x: 0, y: 0},
        radius: earthRadius * 0.8,
        color: `lightblue`,
      },
      {
        name: `neptune`,
        orbits: `sun`,
        orbitDistance: earthDistanceToSun * 30,
        daysToOrbit: 60190,
        position: {x: 0, y: 0},
        radius: earthRadius * 0.6,
        color: `blue`,
      }
    ];
    this.bodies.forEach(body => {
      body.originalRadius = body.radius,
      body.originalOrbitDistance = body.orbitDistance;
    });
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
        const orbitRate = (Math.PI * 2) / 60;
        for (const body of this.bodies) {
          const angle = now * (365 / body.daysToOrbit * orbitRate);
          let position = {x: body.position.x, y: body.position.y};
          if (body.orbits) {
            const orbitedBody = this.bodies.find(b => b.name === body.orbits);
            const bodyPixelPosition = {
              x: (orbitedBody.position.x * oW) + orbitedBody.radius  / 2+ body.orbitDistance,
              y: (orbitedBody.position.y * oH) + orbitedBody.radius / 2 + body.orbitDistance,
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