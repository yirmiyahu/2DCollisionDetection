export default class {
  constructor(firstPoint, secondPoint) {
    Object.assign(this, { firstPoint, secondPoint });
  }

  move(movementArgs) {
    this.firstPoint.move.apply(this.firstPoint, movementArgs);
  }
}
