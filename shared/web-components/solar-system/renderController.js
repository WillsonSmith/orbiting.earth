export class RenderController {
  constructor(host, {engine, version, canvas}) {
    this.engine = engine;
    this.version = version;
    this._bodies = new Map();
    (this.host = host).addController(this);
  }

  hostConnected() {
    console.log(this._renderConnectedLog(this.engine, this.version));
  }
  hostDisconnected() {
    console.log(`Host • disconnected`);
  }

  addBody(body) {
    this._bodies.set(body.name, body);
    this.host.requestUpdate();
  }

  removeBody(name) {
    this._bodies.delete(name);
    this.host.requestUpdate();
  }

  updateBody(body) {
    this._bodies.set(body.name, body);
    this.host.requestUpdate();
  }

  renderBodies() {
    if (this.engine === `canvas`) this.renderCanvas();
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
