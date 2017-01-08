import Polygon from 'polygon';

export default class Pen {
  constructor(ctx) {
    this._ctx = ctx;
  }

  draw(polygon, config) {
    const { ignoreBounds, customGlowSettings } = config;
    this._ctx.save();
    this._strokeAndFill(polygon, customGlowSettings);

    if (!ignoreBounds) {
      this._strokeBounds(polygon);
    }

    this._ctx.restore();
  }

  _strokeAndFill(polygon, customGlowSettings) {
    this._setup(polygon, customGlowSettings);
    this._drawVertices(polygon);
    this._fill();
    this._stroke();
  }

  _setup(object, customGlowSettings) {
    const glowSettings = customGlowSettings || Polygon.glowCanvasSettings;
    const canvasSettings = object.inContact ? glowSettings :
      object.canvasSettings;
    Object.assign(this._ctx, canvasSettings);
  }

  _drawVertices(polygon) {
    const [ first, ...rest ] = polygon.vertices;
    this._ctx.beginPath();
    this._ctx.moveTo(first.x, first.y);

    rest.forEach((vertex) => {
      this._ctx.lineTo(vertex.x, vertex.y);
    });

    this._ctx.closePath();
  }

  _strokeBounds(polygon) {
    const { min, max } = polygon.bounds;
    Object.assign(this._ctx, Polygon.boundsCanvasSettings);
    this._ctx.strokeRect(min.x, min.y, max.x - min.x, max.y - min.y);
  }

  _fill() {
    this._ctx.globalAlpha = this._ctx._fillAlpha;
    this._ctx.fill();
  }

  _stroke() {
    this._ctx.globalAlpha = this._ctx._strokeAlpha;
    this._ctx.stroke();
  }
}
