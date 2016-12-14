import Pen from 'pen';
import Vector from 'vector';

export default class {
  constructor(d, canvasId) {
    this._canvas = d.getElementById(canvasId);
    this._context = this._canvas.getContext('2d');
    this._setBounds();
    this._pen = new Pen(this._context);
  }

  _setBounds() {
    this._bounds = {
      min: new Vector(),
      max: new Vector(this._canvas.width, this._canvas.height),
    };
  }

  get width() {
    return this._bounds.max.x - this._bounds.min.x;
  }

  get height() {
    return this._bounds.max.y - this._bounds.min.y;
  }

  clear() {
    this._context.clearRect(0, 0, this.width, this.height);
  }

  render(element) {
    this._pen.draw(element);
  }
}
