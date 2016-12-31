import { debounce, isFunction } from 'util';

export default class {
  constructor(engine) {
    this._engine = engine;

    this.panelItems.buttons.forEach((item) => {
      const { selector, message } = item;
      this._activateButton(selector, message);
    });
    this.panelItems.checkboxes.forEach((item) => {
      const { selector, message } = item;
      this._activateCheckbox(selector, message);
    });
    this.panelItems.textInputs.forEach((item) => {
      const { selector, message } = item;
      this._activateTextInput(selector, message);
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
      }],
      checkboxes: [{
        selector: '#toggle-backdrop',
        message: 'toggleBackdrop'
      }, {
        selector: '#toggle-bounding-boxes',
        message: 'toggleBoundingBoxes'
      }],
      textInputs: [{
        selector: '#custom-collision-color',
        message: 'changeCollisionColor'
      }]
    };
  }

  _activateButton(selector, message) {
    const button = this._engine.d.querySelector(selector);
    button.addEventListener('click', this._notifyEngine.bind(this, { message }));
  }

  _activateCheckbox(selector, message) {
    const checkbox = this._engine.d.querySelector(selector);
    const getValue = () => { return checkbox.checked; };
    checkbox.addEventListener('click', this._notifyEngine.bind(this, { message, getValue }));
  }

  _activateTextInput(selector, message) {
    const textInput = this._engine.d.querySelector(selector);
    const getValue = () => { return textInput.value; };
    textInput.addEventListener('keyup', debounce(() => {
      this._notifyEngine({ message, getValue });
    }, 250));
  }

  _notifyEngine(params) {
    const { message, getValue } = params;
    let value;
    if (params.getValue && isFunction(params.getValue)) {
      value = getValue();
    }
    this._engine.routeMessage(message, value);
  }
}
