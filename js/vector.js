import { isNumber } from 'util';

export default class {
  constructor(x, y) {
    this._set(x, y);
  }

  _set(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  divide(scalarVal) {
    if (scalarVal !== 0) {
      this.x /= scalarVal;
      this.y /= scalarVal;
    }

    return this;
  }

  min(vertex) {
    this.x = Math.min(this.x, vertex.x);
    this.y = Math.min(this.y, vertex.y);
    return this;
  }

  max(vertex) {
    this.x = Math.max(this.x, vertex.x);
    this.y = Math.max(this.y, vertex.y);
    return this;
  }

  move(vector, angle, pivot) {
    if (vector && vector instanceof this.constructor) {
      this._translate(vector);
    }

    if (angle && isNumber(angle)) {
      this._rotate(angle, pivot);
    }
  }

  _translate(vector) {
    this.add(vector);
  }

  _rotate(angle, pivot) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const dx = this.x - pivot.x;
    const dy = this.y - pivot.y;
    this.x = cos * dx - sin * dy + pivot.x;
    this.y = sin * dx + cos * dy + pivot.y;
  }
}
