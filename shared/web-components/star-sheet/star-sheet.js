import { LitElement, html } from 'lit';

class StarSheet extends LitElement {
  static get properties() {
    return {
      seed: { type: Number },
      starDensity: { type: Number, attribute: `star-density` },
      starCount: { type: Number },
      stars: { type: Array },
    };
  }

  constructor() {
    super();
    this.seed = Date.now();
    this.rng = seededPseudoRandom(this.seed);
    this.starDensity = 20;
  }

  firstUpdated() {
    this.canvas = this.shadowRoot.querySelector(`canvas`);
    this.context = this.canvas.getContext(`2d`);
    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.canvas.width = this.offsetWidth * window.devicePixelRatio;
    this.canvas.height = this.offsetHeight * window.devicePixelRatio;
    this.canvas.style.width = `${this.offsetWidth}px`;
    this.canvas.style.height = `${this.offsetHeight}px`;
    this._generateStars();
    this.renderStars();
  }

  updated(changedProperties) {
    if (changedProperties.has(`starCount`)) {
      this.renderStars();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.resizeObserver = new ResizeObserver((entries) => {
      this.canvas.width = this.offsetWidth * window.devicePixelRatio;
      this.canvas.height = this.offsetHeight * window.devicePixelRatio;
      this.canvas.style.width = `${this.offsetWidth}px`;
      this.canvas.style.height = `${this.offsetHeight}px`;
      this.rng = seededPseudoRandom(this.seed);
      this._generateStars();

      requestAnimationFrame(() => {
        this.renderStars();
      });
    });
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.unobserve(this);
  }

  render() {
    return html` <canvas></canvas> `;
  }

  renderStars() {
    this.context.fillStyle = `#000`;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = `#fff`;
    this.stars.forEach((star) => {
      this.context.beginPath();
      this.context.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      this.context.fill();
    });
  }

  _generateStars() {
    this.starCount = (this.offsetWidth / 100) * this.starDensity;
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: this.rng.next() * this.canvas.width,
        y: this.rng.next() * this.canvas.height,
        radius: this.rng.next() * 5,
      });
    }
  }
}

function seededPseudoRandom(initSeed) {
  let seed = initSeed % 2147483647;
  if (seed <= 0) seed += 2147483646;

  function next() {
    return (seed = (seed * 16807) % 2147483647);
  }

  return {
    next() {
      return (next() - 1) / 2147483646;
    },
  };
}

customElements.define(`star-sheet`, StarSheet);
