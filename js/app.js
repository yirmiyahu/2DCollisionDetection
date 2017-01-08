import Engine from 'engine';
import Panel from 'panel';
import Router from 'router';
import { debounce } from 'util';

export default class {
  constructor(w, d, canvasId) {
    this._initializeEngine(w, d, canvasId);
    this._initializeRouter();
    this._initializePanel(d);
    this._addResizeListener(w);
  }

  _initializeEngine(w, d, canvasId) {
    this._engine = new Engine(w, d, canvasId);
  }

  _initializeRouter() {
    this._router = new Router(this._engine);
  }

  _initializePanel(d) {
    this._panel = new Panel(d, this._router);
  }

  _addResizeListener(w) {
    w.addEventListener('resize', debounce(() => {
      this._engine.resizeView();
    }, 250));
  }

  run() {
    this._engine.run();
  }
}
