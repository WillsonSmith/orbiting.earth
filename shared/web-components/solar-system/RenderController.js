export class RenderController {
  constructor(host, {engine, version, canvas}) {
    this.host = host;
    this.host.addController(this);
    this.engine = engine;
    this.version = version;
    this._bodies = new Map();
  }

  hostConnected() {
    console.log(this._renderConnectedLog(this.engine, this.version));
  }
  hostDisconnected() {
    console.log(`Host • disconnected`);
  }

  addBody(body) {
    this._bodies.set(body.name, body);
    this.renderBodies();
  }

  removeBody(name) {
    this._bodies.delete(name);
    this.renderBodies();
  }

  updateBody(body) {
    this._bodies.set(body.name, body);
    this.renderBodies();
  }

  renderBodies({resize = false} = {}) {
    if (this.engine === `canvas`) {
      if (resize) {
        const host = this.host;
        this.canvas.width = host.offsetWidth * window.devicePixelRatio;
        this.canvas.height = host.offsetHeight * window.devicePixelRatio;
        this.canvas.style.width = `${host.offsetWidth}px`;
        this.canvas.style.height = `${host.offsetHeight}px`;
      }
      this.renderCanvas();
    }
  }

  renderCanvas() {
    requestAnimationFrame(() => {
      const ctx = this.context;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (const body of this._bodies.values()) {
        let {position, radius, color} = body;
        const x = (position.x) * this.canvas.width;
        const y = (position.y) * this.canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
      }
    });
  }

  _renderConnectedLog (engine, version) {
    return (`Renderrer • Connected`, {engine, version});
  }
}
