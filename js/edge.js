import { inRangeInclusive } from 'util';

export default class {
  constructor(firstPoint, secondPoint) {
    Object.assign(this, { firstPoint, secondPoint });
  }

  move(movementArgs) {
    this.firstPoint.move.apply(this.firstPoint, movementArgs);
  }

  static intersects(edge, other) {
    const s = this._computeSegment(edge);
    const t = this._computeSegment(other);
    const u = this._computeSegment(edge, other);
    const v = this._computeDivisor(s, t);
    const a = this._computeDeterminant(s, u, v);
    const b = this._computeDeterminant(t, u, v);
    return inRangeInclusive(a, 0, 1) && inRangeInclusive(b, 0, 1);
  }

  static _computeSegment(edge, other) {
    return other ? {
      x: edge.firstPoint.x - other.firstPoint.x,
      y: edge.firstPoint.y - other.firstPoint.y,
    } : {
      x: edge.secondPoint.x - edge.firstPoint.x,
      y: edge.secondPoint.y - edge.firstPoint.y,
    };
  }

  static _computeDivisor(s, t) {
    return s.x * t.y - t.x * s.y;
  }

  static _computeDeterminant(segment, u, v) {
    return (segment.x * u.y - segment.y * u.x) / v;
  }
}
