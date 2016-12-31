import 'css/styles.css';
import Panel from 'panel';
import Polygon from 'polygon';
import View from 'view';
import { debounce } from 'util';

class App {
  constructor(w, d, canvasId) {
    this._assignContexts(w, d);
    this._initializeView(canvasId);
    this._constructElements();
    this._initializePanel();
    this._addResizeListener();
  }

  _assignContexts(w, d) {
    this._w = w;
    this._d = d;
  }

  get d() {
    return this._d;
  }

  _initializeView(canvasId) {
    this._view = new View(this._w, this._d, canvasId);
  }

  _constructElements() {
    this._elements = [];
    for (let i = 0; i < this.constructor.maxElementsCount; i++) {
      this._createElement();
    }
  }

  static get maxElementsCount() {
  }

  _createElement() {
    const polygon = Polygon.makeRandom(this._view);
    this._elements.push(polygon);
  }

  _destroyElement() {
    this._elements = this._elements.splice(1);
  }

  _initializePanel() {
    this._panel = new Panel(this);
  }

  routeMessage(message, value) {
    this.panelMessageRouter[message](value);
  }

  get panelMessageRouter() {
    return {
      addElement: this._createElement.bind(this),
      removeElement: this._destroyElement.bind(this),
      toggleBackdrop: this._toggleCanvasBackground.bind(this),
      toggleBoundingBoxes: this._toggleRenderingBounds.bind(this),
      changeCollisionColor: this._applyCustomGlowSettings.bind(this)
    };
  }

  _addResizeListener() {
    this._w.addEventListener('resize', debounce(() => {
      this._resizeView();
    }, 250));
  }

  _resizeView() {
    this._view.sizeCanvas(this._w) ;
    this._recalibrateElements();
  }

  _recalibrateElements() {
    this._elements.forEach((element) => {
      Polygon.makeTranslatedClones(element, this._view);
    });
  }

  _toggleCanvasBackground(checked) {
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

  _toggleRenderingBounds(checked) {
    this._view.toggleRenderingBounds(checked);
  }

  _applyCustomGlowSettings(hexColor) {
    this._view.applyCustomGlowSettings(hexColor);
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
    this._view.checkForCollisions(this._elements);
    this._elements.forEach((element, i, collection) => {
      this._view.render(element);
      element.move();
      this._handlePossibleSuccession(element, i, collection);
    });
  }

  _handlePossibleSuccession(element, i, collection) {
    if (element.clones && element.clones.length > 0) {
      element.clones.forEach((clone) => {
        if (this._view.hasOverlapping(clone)) {
          collection[i] = clone;
          Polygon.makeTranslatedClones(clone, this._view);
        }
      });
    }
  }
}

((w, d, cId) => {
  const app = new App(w, d, cId);
  app.run();
})(window, document, 'canvas');
