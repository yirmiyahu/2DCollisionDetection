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
    return new this(vertices, { canvasSettings });
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

  get canvasSettings() {
    return this._config.canvasSettings;
  }
}
