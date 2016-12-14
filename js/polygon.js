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

    const canvasSettings = Object.assign(this.defaultCanvasSettings,
        this.randomColorSettings);
    const movementSettings = this.randomMovementSettings;
    return new this(vertices, { canvasSettings, movementSettings });
  }

  static get defaultCanvasSettings() {
    return {
      _fillAlpha: 0.5,
      _strokeAlpha: 1,
      lineWidth: 1
    };
  }

  static get randomColorSettings() {
    const color = Color.generateRandom();
    return {
      fillStyle: color,
      strokeStyle: color
    };
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
    if (this._config.movementSettings) {
      const { vector, angle } = this.movementSettings;
      const pivot = this.movementSettings.pivot || this.center;
      const movementArgs = [vector, angle, pivot];

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
}
