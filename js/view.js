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

  get bounds() {
    return this._bounds;
  }

  clear() {
    this._context.clearRect(0, 0, this.width, this.height);
  }

  render(element) {
    this._pen.draw(element);
    if (element.clones.length > 0) {
      element.clones.forEach((clone) => {
        this._pen.draw(clone);
      });
    }
  }

  hasLost(element) {
    const { min, max } = element.bounds;
    const { min: minB, max: maxB } = this._bounds;
    return max.x <= minB.x || max.y <= minB.y || min.x >= maxB.x ||
      min.y >= maxB.y;
  }

  contains(element) {
    const { min, max } = element.bounds;
    const { min: minB, max: maxB } = this._bounds;
    return min.x > minB.x && min.y > minB.y && max.x < maxB.x && max.y < maxB.y;
  }

  hasOverlapping(element) {
    return !this.hasLost(element) && !this.contains(element);
  }
}
