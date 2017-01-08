import Edge from 'edge';
import Polygon from 'polygon';
import Vector from 'vector';
import { collisionSandbox, randomTriangle, randomVector } from 'helper';

describe('Polygon', () => {
  describe('#constructor', () => {
    describe('given a collection of vertices and a configuration object', () => {
      it('constructs', () => {
        const vertices = [randomVector(), randomVector(), randomVector()];
        const config = { inContact: true, rest: {} };
        const polygon = new Polygon(vertices, config);

        expect(polygon.vertices).toBe(vertices);

        expect(polygon.bounds).toEqual(jasmine.objectContaining({
          min: jasmine.anything(Vector),
          max: jasmine.anything(Vector)
        }));

        expect(polygon.edges.length).toBe(vertices.length);

        expect(polygon.edges).toEqual(jasmine.arrayContaining([
          jasmine.anything(Edge),
          jasmine.anything(Edge),
          jasmine.anything(Edge)
        ]));

        expect(polygon.inContact).toBe(true);
      });
    });
  });

  describe('#clone', () => {
    describe('given a translation vector', () => {
      it('clones the polygon and translates it according to the passed vector', () => {
        const translationVector = new Vector(Math.random(), Math.random());
        const { x, y } = translationVector;
        const polygon = randomTriangle();
        const clonesLength = polygon.clones.length;
        const clone = polygon.clone(translationVector);

        expect(clone).not.toEqual(polygon);
        expect(polygon.clones.length).toBe(clonesLength + 1);
        expect(polygon.clones).toContain(clone);

        for (let i = 0; i < polygon.vertices.length; i++) {
          expect(clone.vertices[i].x).toBe(polygon.vertices[i].x + x);
          expect(clone.vertices[i].y).toBe(polygon.vertices[i].y + y);
        }
      });
    });
  });

  describe('.areTouching', () => {
    describe('given two polygons', () => {
      it('verifies whether the two polygons are touching', () => {
        const {
          testPolygon,
          enclosingPolygon,
          intersectingPolygon,
          excludingPolygon
        } = collisionSandbox();

        expect(Polygon.areTouching(testPolygon, enclosingPolygon)).toBe(true);
        expect(Polygon.areTouching(testPolygon, intersectingPolygon)).toBe(true);
        expect(Polygon.areTouching(testPolygon, excludingPolygon)).toBe(false);
      });
    });
  });

  describe('#intersects', () => {
    describe('given another polygon', () => {
      it('verifies whether the current polygon intersects it', () => {
        const {
          testPolygon,
          intersectingPolygon,
          excludingPolygon
        } = collisionSandbox();

        expect(testPolygon.intersects(intersectingPolygon)).toBe(true);
        expect(testPolygon.intersects(excludingPolygon)).toBe(false);
      });
    });
  });

  describe('#inside', () => {
    describe('given another polygon', () => {
      it('verifies whether the current polygon is inside of it', () => {
        const {
          testPolygon,
          enclosingPolygon,
          excludingPolygon
        } = collisionSandbox();

        expect(testPolygon.inside(enclosingPolygon)).toBe(true);
        expect(testPolygon.inside(excludingPolygon)).toBe(false);
      });
    });
  });

  describe('.flag', () => {
    describe('given a collection of polygons', () => {
      it('indicates that the included polygons are in contact', () => {
        const collection = [randomTriangle(), randomTriangle(), randomTriangle()];
        Polygon.flag(collection);

        for (let i = 0; i < collection.length; i++) {
          expect(collection[i].inContact).toBe(true);
        }
      });
    });
  });

  describe('#flag', () => {
    it('indicates that the polygon is in contact', () => {
      const polygon = randomTriangle();
      polygon.flag();

      expect(polygon.inContact).toBe(true);
    });
  });

  describe('.unflag', () => {
    describe('given a collection of polygons', () => {
      it('indicates that the included polygons are not in contact', () => {
        const collection = [randomTriangle(), randomTriangle(), randomTriangle()];
        Polygon.unflag(collection);

        for (let i = 0; i < collection.length; i++) {
          expect(collection[i].inContact).toBe(false);
        }
      });
    });
  });

  describe('#unflag', () => {
    it('indicates that the polygon is not in contact', () => {
      const polygon = randomTriangle();
      polygon.unflag();

      expect(polygon.inContact).toBe(false);
    });
  });
});
