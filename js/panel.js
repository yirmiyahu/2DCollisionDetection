import isFunction from 'lodash/isFunction';
import { debounce } from 'util';

export default class {
  constructor(d, router) {
    this._d = d;
    this._router = router;
    this._activatePanelItems();
  }

  _activatePanelItems() {
    this._activateButtons();
    this._activateCheckboxes();
    this._activateTextInputs();
  }

  _activateButtons() {
    this.panelItems.buttons.forEach((item) => {
      const { selector, message } = item;
      this._activateButton(selector, message);
    });
  }

  _activateCheckboxes() {
    this.panelItems.checkboxes.forEach((item) => {
      const { selector, message } = item;
      this._activateCheckbox(selector, message);
    });
  }

  _activateTextInputs() {
    this.panelItems.textInputs.forEach((item) => {
      const { selector, message } = item;
      this._activateTextInput(selector, message);
    });
  }

  get panelItems() {
    return {
      buttons: [
        {
          selector: '.panel__add-element',
          message: 'addElement'
        }, {
          selector: '.panel__remove-element',
          message: 'removeElement'
        }
      ],
      checkboxes: [
        {
          selector: '#toggle-backdrop',
          message: 'toggleBackdrop'
        }, {
          selector: '#toggle-bounding-boxes',
          message: 'toggleBoundingBoxes'
        }
      ],
      textInputs: [
        {
          selector: '#custom-collision-color',
          message: 'changeCollisionColor'
        }
      ]
    };
  }

  _activateButton(selector, message) {
    const button = this._getElement(selector);

    button.addEventListener('click',
      this._notifyRouter.bind(this, { message }));
  }

  _activateCheckbox(selector, message) {
    const checkbox = this._getElement(selector);
    const getValue = () => { return checkbox.checked; };

    checkbox.addEventListener('click',
      this._notifyRouter.bind(this, { message, getValue }));
  }

  _activateTextInput(selector, message) {
    const textInput = this._getElement(selector);
    const getValue = () => { return textInput.value; };

    textInput.addEventListener('keyup', debounce(() => {
      this._notifyRouter({ message, getValue });
    }, 250));
  }

  _getElement(selector) {
    return this._d.querySelector(selector);
  }

  _notifyRouter(params) {
    const { message, getValue } = params;
    let value;

    if (params.getValue && isFunction(params.getValue)) {
      value = getValue();
    }

    this._router.route(message, value);
  }
}
