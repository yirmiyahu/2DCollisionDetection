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
  }

  static makeRandom(radius) {
    const vertices = [];
    const verticesCount = random(4, 12);
    const angleSeparation = 2 * Math.PI / verticesCount;

    for (let i = 0, angle, x, y, variance; i < verticesCount; i++) {
      angle = angleSeparation * (i + 1);
      variance = 1.5 - Math.random();
      x = variance * radius * Math.cos(angle);
      y = variance * radius * Math.sin(angle);
      vertices.push(new Vector(x, y));
    }

    const canvasSettings = Object.assign(this.paintSettings,
        this.colorSettings());
    const movementSettings = this.randomMovementSettings;
    return new this(vertices, { canvasSettings, movementSettings });
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
    this.clones.push(new this.constructor(clonedVertices, this._config));
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
}
