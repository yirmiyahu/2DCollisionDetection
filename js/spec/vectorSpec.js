import Polygon from 'polygon';
import Vector from 'vector';
import { random } from 'util';
import { collisionSandbox, randomVector } from 'helper';

describe('Vector', () => {
  describe('#constructor', () => {
    describe('given two scalar values', () => {
      it('constructs', () => {
        const x = Math.random();
        const y = Math.random();
        const vector = new Vector(x, y);

        expect(vector).toEqual(jasmine.any(Vector));
        expect(vector.x).toBe(x);
        expect(vector.y).toBe(y);
      });
    });

    describe('given no values', () => {
      it('constructs at { x: 0, y: 0 }', () => {
        const vector = new Vector();

        expect(vector).toEqual(jasmine.any(Vector));
        expect(vector.x).toBe(0);
        expect(vector.y).toBe(0);
      });
    });
  });

  describe('#add', () => {
    describe('given another vector', () => {
      it('adds it to the current vector', () => {
        const vector = randomVector();
        const other = randomVector();
        const { x, y } = vector;
        vector.add(other);

        expect(vector.x).not.toBe(x);
        expect(vector.y).not.toBe(y);
        expect(vector.x).toBe(x + other.x);
        expect(vector.y).toBe(y + other.y);
      });
    });
  });

  describe('#divide', () => {
    describe('given a scalar divisor', () => {
      it('divides the current vector', () => {
        const vector = randomVector();
        const divisor = random(4, 12);
        const { x, y } = vector;
        vector.divide(divisor);

        expect(vector.x).not.toBe(x);
        expect(vector.y).not.toBe(y);
        expect(vector.x).toBe(x / divisor);
        expect(vector.y).toBe(y / divisor);
      });
    });
  });

  describe('#min', () => {
    describe('given another vector or vertex', () => {
      it(`sets the current vector's coordinates to the lesser coordinates`, () => {
        const vector = new Vector(-1, 10);
        const other = new Vector(0, -10);
        const { x, y } = vector;
        vector.min(other);

        expect(vector.x).not.toBe(other.x);
        expect(vector.x).toBe(x);
        expect(vector.y).not.toBe(y);
        expect(vector.y).toBe(other.y);
      });
    });
  });

  describe('#max', () => {
    describe('given another vector or vertex', () => {
      it(`sets the current vector's coordinates to the greater coordinates`, () => {
        const vector = new Vector(-1, 10);
        const other = new Vector(0, -10);
        const { x, y } = vector;
        vector.max(other);

        expect(vector.x).not.toBe(x);
        expect(vector.x).toBe(other.x);
        expect(vector.y).not.toBe(other.y);
        expect(vector.y).toBe(y);
      });
    });
  });

  describe('#move', () => {
    describe('given a velocity vector, scalar angle measure, and a pivot point', () => {
      it('moves the current vector accordingly', () => {
        const movingVector = new Vector(0, 0);
        const velocity = new Vector(1, 1);
        const angle = Math.PI / 2;
        const pivot = new Vector(0, 1);
        const { x, y } = movingVector;
        movingVector.move(movingVector, angle, pivot);

        expect(movingVector.x).not.toBe(x);
        expect(movingVector.y).not.toBe(y);
        expect(movingVector.x).toBe(1);
        expect(movingVector.y).toBeCloseTo(1);
      });
    });
  });

  describe('#inside', () => {
    describe('given polygons composed of several vertices', () => {
      it('detects whether the vector is inside the polygon', () => {
        const {
          testVector, enclosingPolygon, excludingPolygon
        } = collisionSandbox();

        expect(testVector.inside(enclosingPolygon)).toBe(true);
        expect(testVector.inside(excludingPolygon)).toBe(false);
      });
    });
  });
});
