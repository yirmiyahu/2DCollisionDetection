import Engine from 'engine';

export default class {
  constructor(engine) {
    this._engine = engine;
  }

  get routes() {
    return {
      addElement: 'createElement',
      removeElement: 'destroyElement',
      toggleBackdrop: 'toggleCanvasBackground',
      toggleBoundingBoxes: 'toggleRenderingBounds',
      changeCollisionColor: 'applyCustomGlowSettings'
    };
  }

  route(message, value) {
    const action = this.routes[message];
    this._engine[action](value);
  }
}
