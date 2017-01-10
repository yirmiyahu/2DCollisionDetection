import Color from 'color';
import Edge from 'edge';
import Vector from 'vector';
import isEmpty from 'lodash/isEmpty';
import random from 'lodash/random';
import sample from 'lodash/sample';

export default class {
  constructor(vertices, config) {
    this._vertices = vertices;
    this._center = new Vector();
    this._bounds = {};
    this._edges = [];
    this._clones = [];

    if (this._vertices && this._vertices.length > 2) {
      this._initializeComponents();
    }

    this._setup(config);
  }

  get vertices() {
    return this._vertices;
  }

  get bounds() {
    return this._bounds;
  }

  get edges() {
    return this._edges;
  }

  get clones() {
    return this._clones;
  }

  _initializeComponents() {
    this._vertices.forEach((vertex, i, arr) => {
      this._computeCenterFrom(vertex, arr);
      this._computeBoundsFrom(vertex);
      const nextRollingIdx = (i + 1) % arr.length;
      this._buildEdgeFrom(vertex, arr[nextRollingIdx]);
    });
  }

  _computeCenterFrom(vertex, arr) {
    this._center.add(vertex);
    const lastIdx = arr.length - 1;

    if (vertex === arr[lastIdx]) {
      this._center.divide(arr.length);
    }
  }

  _computeBoundsFrom(vertex) {
    if (isEmpty(this._bounds)) {
      this._initializeBounds(vertex);
    } else {
      this._bounds.min.min(vertex);
      this._bounds.max.max(vertex);
    }
  }

  _initializeBounds(vertex) {
    this._bounds.min = new Vector(vertex.x, vertex.y);
    this._bounds.max = new Vector(vertex.x, vertex.y);
  }

  _buildEdgeFrom(vertex, otherVertex) {
    this._edges.push(new Edge(vertex, otherVertex));
  }

  _setup(config) {
    if (config) {
      const { inContact, ...settings } = config;
      this._config = settings;
      this.inContact = inContact || false;
    }
  }

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

  static get boundsCanvasSettings() {
    return {
      strokeStyle: '#666',
      lineWidth: 0.5
    };
  }

  static get glowCanvasSettings() {
    const glowColor = '#e80058';
    return Object.assign(this.paintSettings, this.colorSettings(glowColor));
  }

  static get randomMovementSettings() {
    const posOrNeg = () => { return sample([-1, 1]); };
    const randomFactor = () => { return posOrNeg() * Math.random(); };
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

    if (this._clones.length > 0) {
      this._clones.forEach((clone) => {
        clone.moveComponents();
      });
    }
  }

  moveComponents() {
    if (this._config && this._config.movementSettings) {
      const { velocity, angle } = this._config.movementSettings;
      const pivot = this._config.movementSettings.pivot || this._center;
      const movementArgs = [velocity, angle, pivot];
      this._clearBounds();
      this._center.move.apply(this._center, movementArgs);
      this._edges.forEach((edge) => {
        edge.move(movementArgs);
        this._computeBoundsFrom(edge.firstPoint);
      });
    }
  }

  _clearBounds() {
    this._bounds = {};
  }

  static makeTranslatedClones(polygon, view) {
    this._clearClones(polygon);
    const viewVector = view.bounds.max;
    const vectors = this._computeCloneVectors(polygon, viewVector);

    if (vectors) {
      vectors.forEach((vector) => {
        this._replicate(polygon, vector);
      });
    }
  }

  static _clearClones(polygon) {
    if (polygon.clones && polygon.clones.length > 0) {
      polygon.clearClones();
    }
  }

  clearClones() {
    this._clones = [];
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
    this._clones.push(clone);
    return clone;
  }

  _cloneVertices(translationVector) {
    return this._vertices.map((vertex) => {
      const { x, y } = vertex;
      const clonedVertex = new Vector(x, y);

      if (translationVector) {
        clonedVertex.add(translationVector);
      }

      return clonedVertex;
    });
  }

  static areTouching(polygon, other) {
    return polygon.intersects(other) || polygon.inside(other) ||
      other.inside(polygon);
  }

  intersects(other) {
    return this._edges.some((edge) => {
      return other.edges.some((otherEdge) => {
        return Edge.intersects(edge, otherEdge);
      });
    });
  }

  inside(other) {
    return this._vertices.some((vertex) => {
      return vertex.inside(other);
    });
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
