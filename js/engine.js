import Polygon from 'polygon';
import View from 'view';

export default class {
  constructor(w, d, canvasId) {
    this._assignContexts(w, d);
    this._initializeView(canvasId);
    this._constructElements();
  }

  _assignContexts(w, d) {
    this._w = w;
    this._d = d;
  }

  _initializeView(canvasId) {
    this._view = new View(this._w, this._d, canvasId);
  }

  _constructElements() {
    this._elements = [];

    for (let i = 0; i < this.constructor.elementsCount; i++) {
      this.createElement();
    }
  }

  static get elementsCount() {
    return 5;
  }

  run() {
    this._loop();
  }

  _loop() {
    this._w.requestAnimationFrame(() => {
      this._tick();
      this._loop();
    });
  }

  _tick() {
    this._view.clear();
    this._checkForCollisions();

    this._elements.forEach((element, i, collection) => {
      this._view.render(element);
      element.move();
      this._handlePossibleSuccession(element, i, collection);
    });

    this._view.replaceCanvasContext();
  }

  _checkForCollisions() {
    const elements = this._elements;
    const inView = (clone) => { return !this._view.hasLost(clone); };
    const collections = {};

    elements.forEach((element, i) => {
      const collection = element.clones.filter(inView).concat(element);
      collections[i] = collection;
      Polygon.unflag(collection);
    });

    for (let i = 0; i < elements.length - 1; i++) {
      const collection = collections[i];

      for (let j = i + 1; j < elements.length; j++) {
        const other = collections[j];

        if (this._collisionBetween(collection, other)) {
          if (!elements[i].inContact) {
            Polygon.flag(collection);
          }

          Polygon.flag(other);
        }
      }
    }
  }

  _collisionBetween(collection, other) {
    return collection.some((element) => {
      if (!this._view.hasLost(element)) {
        return other.some((other) => {
          if (!this._view.hasLost(other)) {
            return Polygon.areTouching(element, other);
          }
        });
      }
    });
  }

  _handlePossibleSuccession(element, i, collection) {
    if (element.clones && element.clones.length > 0) {
      const onEdge = (clone) => { return this._view.hasOverlapping(clone); };
      const successor = element.clones.find(onEdge);

      if (successor) {
        collection[i] = successor;
        Polygon.makeTranslatedClones(successor, this._view);
      }
    }
  }

  resizeView() {
    this._view.resizeCanvas(this._w, this._d);
    this._recalibrateElements();
  }

  _recalibrateElements() {
    this._elements.forEach((element) => {
      Polygon.makeTranslatedClones(element, this._view);
    });
  }

  createElement() {
    const polygon = Polygon.makeRandom(this._view);
    this._elements.push(polygon);
  }

  destroyElement() {
    this._elements = this._elements.splice(1);
  }


  toggleCanvasBackground(checked) {
    this._view.toggleCanvasBackground(checked);
    this._changeLabelColor(checked);
  }

  _changeLabelColor(checked) {
    this._d.querySelectorAll('label').forEach((label) => {
      const classList = label.classList;
      const className = 'panel__checkbox-label--readable';
      if (checked) {
        classList.add(className);
      } else {
        classList.remove(className);
      }
    });
  }

  toggleRenderingBounds(checked) {
    this._view.toggleRenderingBounds(checked);
  }

  applyCustomGlowSettings(hexColor) {
    this._view.applyCustomGlowSettings(hexColor);
  }
}
