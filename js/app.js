import 'css/styles.css';
import Polygon from 'polygon';
import View from 'view';

class App {
  constructor(w, d, canvasId) {
    this.w = w;

    this.elements = [];
    this.view = new View(d, canvasId);

    const radius = 100;
    const polygon = Polygon.makeRandom(radius);
    Polygon.makeTranslatedClones(polygon, this.view);
    this.elements.push(polygon);
  }

  run() {
    this._loop();
  }

  _loop() {
    this.w.requestAnimationFrame(() => {
      this._tick();
      this._loop();
    });
  }

  _tick() {
    this.view.clear();
    this.view.checkForCollisions(this.elements);
    this.elements.forEach((element, i, collection) => {
      this.view.render(element);
      element.move();
      this._handlePossibleSuccession(element, i, collection);
    });
  }

  _handlePossibleSuccession(element, i, collection) {
    if (element.clones && element.clones.length > 0) {
      element.clones.forEach((clone) => {
        if (this.view.hasOverlapping(clone)) {
          collection[i] = clone;
          Polygon.makeTranslatedClones(clone, this.view);
        }
      });
    }
  }
}

((w, d, cId) => {
  const app = new App(w, d, cId);
  app.run();
})(window, document, 'canvas');
