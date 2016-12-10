export default class Pen {
  constructor(ctx) {
    this._ctx = ctx;
  }

  draw(polygon, options) {
    this._configure(options);
    this._ctx.save();

    this._determineVertices(polygon);
    this._fill();
    this._stroke();

    this._ctx.restore();
  }

  _configure(options) {
    const config = Object.assign(this.constructor.DEFAULT, options);
    Object.assign(this._ctx, config);
  }

  _determineVertices(polygon) {
    const [ first, ...rest ] = polygon.vertices;
    this._ctx.beginPath();
    this._ctx.moveTo(first.x, first.y);
    rest.forEach((vertex) => {
      this._ctx.lineTo(vertex.x, vertex.y);
    });
    this._ctx.closePath();
  }

  _fill() {
    if (this._ctx._fillAlpha < 1) {
      this._ctx.globalAlpha = this._ctx._fillAlpha;
    }
    this._ctx.fill();
  }

  _stroke() {
    if (this._ctx._strokeAlpha < 1) {
      this._ctx.globalAlpha = this._ctx._strokeAlpha;
    }
    this._ctx.stroke();
  }

  static get DEFAULT() {
    return {
      lineWidth: 1,
      strokeStyle: '#000',
      _strokeAlpha: 1,
      fillStyle: '#000',
      _fillAlpha: 1
    };
  }
}
