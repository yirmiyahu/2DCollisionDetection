import Polygon from 'polygon';
import Vector from 'vector';
import isNumber from 'lodash/isNumber';

function collisionSandbox() {
  const enclosingPolygon = new Polygon([
    new Vector(0, 0),
    new Vector(0, 1),
    new Vector(1, 1),
    new Vector(1, 0)
  ]);

  const excludingPolygon = new Polygon([
    new Vector(2, 2),
    new Vector(2, 3),
    new Vector(3, 3),
    new Vector(3, 2)
  ]);

  const intersectingPolygon = new Polygon([
    new Vector(0.5, 0.5),
    new Vector(0.5, 1.5),
    new Vector(1.5, 1.5),
    new Vector(1.5, 0.5)
  ]);

  const randomEnclosedTriangle = randomTriangle();

  const testPolygon = new Polygon([
    new Vector(0, 0),
    new Vector(0, 1),
    new Vector(1, 1),
    new Vector(1, 0)
  ]);

  const testVector = new Vector(0.5, 0.5);

  return {
    enclosingPolygon,
    excludingPolygon,
    intersectingPolygon,
    randomEnclosedTriangle,
    testPolygon,
    testVector
  };
}

function randomTriangle() {
  return new Polygon([randomVector(), randomVector(), randomVector()]);
}

function randomVector() {
  return new Vector(Math.random(), Math.random());
}

export {
  collisionSandbox,
  randomTriangle,
  randomVector
};
