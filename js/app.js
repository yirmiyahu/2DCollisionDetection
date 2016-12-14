import 'css/styles.css';
import Polygon from 'polygon';
import View from 'view';

class App {
  constructor(w, d, canvasId) {
    this.w = w;
    this.view = new View(d, canvasId);

    this.elements = [];
    const radius = 100;
    const polygon = Polygon.makeRandom(radius);
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
    this.elements.forEach((element, i, collection) => {
      this.view.render(element);
      element.move();
    });
  }
}

((w, d, cId) => {
  const app = new App(w, d, cId);
  app.run();
})(window, document, 'canvas');
