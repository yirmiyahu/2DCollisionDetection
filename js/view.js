import Pen from 'pen';
import Polygon from 'polygon';
import Vector from 'vector';
import { isHexColor } from 'util';

export default class {
  constructor(w, d, canvasId) {
    this._initializeCanvases(w, d, canvasId);
    this._initializePen();
  }

  _initializeCanvases(w, d, canvasId) {
    this._createCanvas(d, canvasId);
    this._sizeCanvas(w);
    this._createOffscreenCanvas(d);
  }

  _createCanvas(d, canvasId) {
    this._canvas = d.getElementById(canvasId);
    this._context = this._canvas.getContext('2d');
  }

  _sizeCanvas(w) {
    this._setCanvasSize(w);
    this._setBounds();
  }

  resizeCanvas(w, d) {
    this._sizeCanvas(w);
    this._createOffscreenCanvas(d);
    this._pen.switchContext(this._offscreenContext);
  }

  _setCanvasSize(w) {
    this._canvas.width = w.innerWidth;
    this._canvas.height = w.innerHeight;
  }

  _setBounds() {
    this._bounds = {
      min: new Vector(),
      max: new Vector(this._canvas.width, this._canvas.height),
    };
  }

  _createOffscreenCanvas(d) {
    const { width, height, id } = this._canvas;
    const offscreen = d.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    offscreen.id = id;
    this._offscreenCanvas = offscreen;
    this._offscreenContext = this._offscreenCanvas.getContext('2d');
  }

  _initializePen() {
    this._pen = new Pen(this._offscreenContext);
  }

  get width() {
    return this._bounds.max.x - this._bounds.min.x;
  }

  get height() {
    return this._bounds.max.y - this._bounds.min.y;
  }

  get bounds() {
    return this._bounds;
  }

  clear() {
    this._context.clearRect(0, 0, this.width, this.height);
    this._offscreenContext.clearRect(0, 0, this.width, this.height);
  }

  replaceCanvasContext() {
    this._context.drawImage(this._offscreenCanvas, 0, 0);
  }

  render(element) {
    const drawConfig = {
      ignoreBounds: this._ignoreBounds,
      customGlowSettings: this._customGlowSettings
    };

    this._pen.draw(element, drawConfig);

    if (element.clones.length > 0) {
      element.clones.forEach((clone) => {
        this._pen.draw(clone, drawConfig);
      });
    }
  }

  hasLost(element) {
    const { min, max } = element.bounds;
    const { min: minB, max: maxB } = this._bounds;

    return max.x <= minB.x || max.y <= minB.y || min.x >= maxB.x ||
      min.y >= maxB.y;
  }

  contains(element) {
    const { min, max } = element.bounds;
    const { min: minB, max: maxB } = this._bounds;
    return min.x > minB.x && min.y > minB.y && max.x < maxB.x && max.y < maxB.y;
  }

  hasOverlapping(element) {
    return !this.hasLost(element) && !this.contains(element);
  }

  generateRandomLocation() {
    const { random } = Math;
    const x = random() * this.width;
    const y = random() * this.height;
    return new Vector(x, y);
  }

  toggleCanvasBackground(checked) {
    const classList = this._canvas.classList;
    const className = 'canvas__backdrop';
    if (checked) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }

  toggleRenderingBounds(checked) {
    this._ignoreBounds = checked ? false : true;
  }

  applyCustomGlowSettings(colorString) {
    const hexColor = this._ensureHashSymbol(colorString);
    if (isHexColor(hexColor)) {
      this._assignCustomGlowSettings(hexColor);
    } else {
      this._removeCustomGlowSettings();
    }
  }

  _ensureHashSymbol(string) {
    return string[0] !== '#' ? `#${string}` : string;
  }

  _assignCustomGlowSettings(hexColor) {
    this._customGlowSettings = Object.assign({}, Polygon.paintSettings,
      Polygon.colorSettings(hexColor));
  }

  _removeCustomGlowSettings() {
    delete this._customGlowSettings;
  }
}
