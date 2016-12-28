import Color from 'color';
import Edge from 'edge';
import Vector from 'vector';
import { isEmpty, random } from 'util';

export default class {
  constructor(vertices, config) {
    this.vertices = vertices;
    this.center = new Vector();
    this.bounds = {};
    this.edges = [];
    this.clones = [];
    this.inContact = false;

    if (this.vertices && this.vertices.length) {
      this._initializeComponents();
    }

    this._config = config;
  }

  _initializeComponents() {
    this.vertices.forEach((vertex, i, arr) => {
      this._computeCenterFrom(vertex, arr);
      this._computeBoundsFrom(vertex);
      this._buildEdgeFrom(vertex, arr[(i + 1) % arr.length]);
    });
  }

  _computeCenterFrom(vertex, arr) {
    this.center.add(vertex);
    if (vertex === arr[arr.length - 1]) {
      this.center.divide(arr.length);
    }
  }

  _computeBoundsFrom(vertex) {
    if (isEmpty(this.bounds)) {
      this._initializeBounds(vertex);
    } else {
      this.bounds.min.min(vertex);
      this.bounds.max.max(vertex);
    }
  }

  _initializeBounds(vertex) {
    this.bounds.min = new Vector(vertex.x, vertex.y);
    this.bounds.max = new Vector(vertex.x, vertex.y);
  }

  _buildEdgeFrom(vertex, otherVertex) {
    this.edges.push(new Edge(vertex, otherVertex));

  static makeRandom(view) {
    const vertices = this._generateVertices(view);
    const canvasSettings = Object.assign(this.paintSettings,
        this.colorSettings());
    const movementSettings = this.randomMovementSettings;
    const polygon = new this(vertices, { canvasSettings, movementSettings });

    if (view) {
      this.makeTranslatedClones(polygon, view);
    }

    return polygon;
  }

  static _generateVertices(view) {
    const vertices = [];
    const canvasLocation = view ? view.generateRandomLocation() : new Vector();
    const randomRadius = random(75, 100);
    const verticesCount = random(3, 12);
    const angleSeparation = 2 * Math.PI / verticesCount;

    for (let i = 0; i < verticesCount; i++) {
      const angle = angleSeparation * (i + 1);
      const variance = 1.5 - Math.random();
      const x = variance * randomRadius * Math.cos(angle) + canvasLocation.x;
      const y = variance * randomRadius * Math.sin(angle) + canvasLocation.y;
      vertices.push(new Vector(x, y));
    }

    return vertices;
  }

  static get paintSettings() {
    return {
      _fillAlpha: 0.5,
      _strokeAlpha: 1,
      lineWidth: 1
    };
  }

  static colorSettings(colorString) {
    const color = colorString || Color.generateRandom();
    return {
      fillStyle: color,
      strokeStyle: color
    };
  }

  static get glowCanvasSettings() {
    const glowColor = '#e80058';
    return Object.assign(this.paintSettings, this.colorSettings(glowColor));
  }

  static get randomMovementSettings() {
    const pn = () => { return random([-1, 1]); };
    const randomFactor = () => { return pn() * Math.random(); };
    const angle = Math.PI / 128;
    const vector = 4;
    return {
      velocity: new Vector(randomFactor() * vector, randomFactor() * vector),
      angle: randomFactor() * angle
    };
  }

  static get defaultMovementSettings() {
    return { velocity: new Vector(), angle: 0 };
  }

  get canvasSettings() {
    return this._config.canvasSettings;
  }

  get movementSettings() {
    return this._config ? this._config.movementSettings :
      this.constructor.defaultMovementSettings;
  }

  move() {
    this.moveComponents();
    if (this.clones.length > 0) {
      this.clones.forEach((clone) => {
        clone.moveComponents();
      });
    }
  }

  moveComponents() {
    if (this._config && this._config.movementSettings) {
      const { velocity, angle } = this._config.movementSettings;
      const pivot = this._config.movementSettings.pivot || this.center;
      const movementArgs = [velocity, angle, pivot];
      this._clearBounds();
      this.center.move.apply(this.center, movementArgs);
      this.edges.forEach((edge) => {
        edge.move(movementArgs);
        this._computeBoundsFrom(edge.firstPoint);
      });
    }
  }

  _clearBounds() {
    this.bounds = {};
  }

  static makeTranslatedClones(polygon, view) {
    const viewVector = view.bounds.max;
    const vectors = this._computeCloneVectors(polygon, viewVector);
    if (vectors) {
      vectors.forEach((vector) => {
        this._replicate(polygon, vector);
      });
    }
  }

  static _computeCloneVectors(polygon, viewVector) {
    if (polygon.movementSettings) {
      const vectors = [];

      const multipliers = [-1, 0, 1];
      multipliers.forEach((x) => {
        multipliers.forEach((y) => {
          if (!(x === 0 && y === 0)) {
            const vector = new Vector(viewVector.x * x, viewVector.y * y);
            vectors.push(vector);
          }
        });
      });

      return vectors;
    }
  }

  static _replicate(polygon, translationVector) {
    if (translationVector) {
      polygon.clone(translationVector);
    }
  }

  clone(translationVector) {
    const clonedVertices = this._cloneVertices(translationVector);
    const clone = new this.constructor(clonedVertices, this._config);
    clone.inContact = this.inContact;
    this.clones.push(clone);
    return clone;
  }

  _cloneVertices(translationVector) {
    return this.vertices.map((vertex) => {
      const { x, y } = vertex;
      const clonedVertex = new Vector(x, y);
      if (translationVector) {
        clonedVertex.add(translationVector);
      }
      return clonedVertex;
    });
  }

  intersects(other) {
    return this.edges.some((edge) => {
      return other.edges.some((otherEdge) => {
        return Edge.intersects(edge, otherEdge);
      });
    });
  }

  inside(other) {
    return this.vertices.some((vertex) => {
      return vertex.inside(other);
    });
  }

  static areTouching(polygon, other) {
    return polygon.intersects(other) || polygon.inside(other) ||
      other.inside(polygon);
  }

  static flag(collection) {
    collection.forEach((polygon) => {
      polygon.flag();
    });
  }

  flag() {
    this.inContact = true;
  }

  static unflag(collection) {
    collection.forEach((polygon) => {
      polygon.unflag();
    });
  }

  unflag() {
    this.inContact = false;
  }
}
