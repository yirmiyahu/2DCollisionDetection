export default class {
  constructor(engine) {
    this._engine = engine;

    this.panelItems.buttons.forEach((item) => {
      const { selector, message } = item;
      this._activateButton(selector, message);
    });
  }

  get panelItems() {
    return {
      buttons: [{
        selector: '.panel__add-element',
        message: 'addElement'
      }, {
        selector: '.panel__remove-element',
        message: 'removeElement'
      }]
    };
  }

  _activateButton(selector, message) {
    const button = this._engine.d.querySelector(selector);
    button.addEventListener('click', this._notifyEngine.bind(this, message));
  }

  _notifyEngine(message) {
    this._engine.routeMessage(message);
  }
}
