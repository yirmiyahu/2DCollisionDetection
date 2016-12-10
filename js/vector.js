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
}
