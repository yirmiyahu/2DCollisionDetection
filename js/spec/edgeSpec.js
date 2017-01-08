import Edge from 'edge';
import Vector from 'vector';
import { randomVector } from 'helper';

describe('Edge', () => {
  describe('#constructor', () => {
    describe('given two points', () => {
      it('constructs', () => {
        const firstPoint = randomVector();
        const secondPoint = randomVector();
        const edge = new Edge(firstPoint, secondPoint);

        expect(edge).toEqual(jasmine.any(Edge));
        expect(edge.firstPoint).toBe(firstPoint);
        expect(edge.secondPoint).toBe(secondPoint);
      });
    });
  });

  describe('#move', () => {
    describe('given that an edge moves in unison with other edges of the same polygon', () => {
      it('moves its first point', () => {
        const firstPoint = randomVector();
        const { x: firstPointX, y: firstPointY } = firstPoint;
        const secondPoint = randomVector();
        const { x: secondPointX, y: secondPointY } = secondPoint;
        const edge = new Edge(firstPoint, secondPoint);

        const velocity = new Vector(1, 1);
        const angle = Math.random() * Math.PI;
        const movementArgs = [ velocity, angle ];
        edge.move(movementArgs);

        expect(edge.secondPoint.x).toBe(secondPointX);
        expect(edge.secondPoint.y).toBe(secondPointY);
        expect(edge.firstPoint.x).not.toBe(firstPointX);
        expect(edge.firstPoint.y).not.toBe(firstPointY);
      });
    });
  });

  describe('.intersects', () => {
    it('checks whether edges intersect', () => {
      const firstEdge = new Edge(new Vector(0, 0), new Vector(1, 1));
      const secondEdge = new Edge(new Vector(0, 1), new Vector(1, 0));
      const thirdEdge = new Edge(new Vector(1, 2), new Vector(3, 2));

      expect(Edge.intersects(firstEdge, secondEdge)).toBe(true);
      expect(Edge.intersects(secondEdge, thirdEdge)).toBe(false);
      expect(Edge.intersects(firstEdge, thirdEdge)).toBe(false);
    });
  });
});
