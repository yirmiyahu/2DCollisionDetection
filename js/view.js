import Pen from 'pen';
import Polygon from 'polygon';
import Vector from 'vector';

export default class {
  constructor(w, d, canvasId) {
    this._initializeCanvas(w, d, canvasId);
    this._initializePen();
  }

  _initializeCanvas(w, d, canvasId) {
    this._canvas = d.getElementById(canvasId);
    this._context = this._canvas.getContext('2d');
    this.sizeCanvas(w);
  }

  sizeCanvas(w) {
    this._setCanvasSize(w);
    this._setBounds();
  }

  _setCanvasSize(w) {
    this._canvas.width = w.innerWidth;
    this._canvas.height = w.innerHeight;
  }

  _setBounds() {
    this._bounds = {
      min: new Vector(),
      max: new Vector(this._canvas.width, this._canvas.height),
    };
  }

  _initializePen() {
    this._pen = new Pen(this._context);
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

  checkForCollisions(elements) {
    outer: for (let i = 0; i < elements.length; i++) {
      const collection = elements[i].clones.concat(elements[i]);
      Polygon.unflag(collection);

      inner: for (let j = 0; j < elements.length; j++) {
        if (i === j) {
          continue inner;
        }

        const other = elements[j].clones.concat(elements[j]);
        if (this._collisionBetween(collection, other)) {
          Polygon.flag(collection);
          continue outer;
        }
      }
    }
  }

  _collisionBetween(collection, other) {
    return collection.some((element) => {
      return other.some((other) => {
        return Polygon.areTouching(element, other);
      });
    });
  }

  generateRandomLocation() {
    const { random } = Math;
    const x = random() * this.width;
    const y = random() * this.height;
    return new Vector(x, y);
  }
}
