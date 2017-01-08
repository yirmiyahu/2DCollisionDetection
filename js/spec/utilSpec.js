import {
  debounce,
  inRange,
  isArray,
  isEmpty,
  isFunction,
  isHexColor,
  isNumber,
  isObject,
  random
} from 'util';

import { greaterThanOrEqualTo, lessThanOrEqualTo } from 'helper';

describe('util', () => {
  describe('.debounce', () => {
    describe('given a wait time', () => {
      const func = jasmine.createSpy('spy');
      const waitTime = 250;
      const debounceCallback = debounce(func, waitTime);

      beforeEach((done) => {
        debounceCallback();

        setTimeout(() => {
          debounceCallback();
          setTimeout(() => {
            debounceCallback();
            setTimeout(() => {
              done();
            }, 250);
          }, 1);
        }, 1);
      });

      it('debounces the passed function so that it only gets called once per interaction period', (done) => {
        expect(func).toHaveBeenCalled();
        expect(func.calls.count()).toEqual(1);
        done();
      });
    });
  });

  describe('.inRange', () => {
    it('verifies whether the passed number is between the passed lower and upper bounds', () => {
      const lower = 0;
      const number = 1;
      const upper = 2;

      expect(inRange(number, lower, upper)).toBe(true);
    });

    it('returns undefined if either of the arguments is not a number', () => {
      const lower = null;
      const number = 1;
      const upper = 2;

      expect(inRange(number, lower, upper)).toBeUndefined();
    });

    it('returns undefined if the upper bound is not greater than the lower', () => {
      const lower = 3;
      const number = 1;
      const upper = 2;

      expect(inRange(number, lower, upper)).toBeUndefined();
    });
  });

  describe('.isArray', () => {
    it('verifies whether the passed argument is an Array', () => {
      const array = [];
      const notArray = null;

      expect(isArray(array)).toBe(true);
      expect(isArray(notArray)).toBe(false);
    });
  });

  describe('.isEmpty', () => {
    it('verifies whether a passed Object is empty', () => {
      const emptyObject = {};
      const filledObject = { x: 0, y: 'bob', z: () => {} };

      expect(isEmpty(emptyObject)).toBe(true);
      expect(isEmpty(filledObject)).toBe(false);
    });

    it('verifies whether a passed Array is empty', () => {
      const emptyArray = [];
      const filledArray = [0, 1, 2];

      expect(isEmpty(emptyArray)).toBe(true);
      expect(isEmpty(filledArray)).toBe(false);
    });

    it('returns null if the argument is neither an Array nor an Object', () => {
      const number = Math.random();

      expect(isEmpty(number)).toBeNull();
    });
  });

  describe('.isFunction', () => {
    it('verifies whether the passed argument is a Function', () => {
      const func = () => {};
      const notFunc = null;

      expect(isFunction(func)).toBe(true);
      expect(isFunction(notFunc)).toBe(false);
    });
  });

  describe('.isHexColor', () => {
    it('verifies whether the passed argument is a valid hex color string', () => {
      const hexColor = '#fff';
      const anotherHexColor = '#000000';
      const otherHexColor = '#0fbc56';
      const notHexColor = '#fffghi';
      const notHexColorAgain = '#fff0';

      expect(isHexColor(hexColor)).toBe(true);
      expect(isHexColor(otherHexColor)).toBe(true);
      expect(isHexColor(anotherHexColor)).toBe(true);
      expect(isHexColor(notHexColor)).toBe(false);
      expect(isHexColor(notHexColorAgain)).toBe(false);
    });

    it('returns undefined if the passed argument is not a string', () => {
      const notHexColorOnceMore = Math.random();

      expect(isHexColor(notHexColorOnceMore)).toBeUndefined();
    });
  });

  describe('.isNumber', () => {
    it('verifies whether the passed argument is a Number', () => {
      const number = Math.random();
      const notNumber = NaN;

      expect(isNumber(number)).toBe(true);
      expect(isNumber(notNumber)).toBe(false);
    });
  });

  describe('.isObject', () => {
    it('verifies whether the passed argument is an Object', () => {
      const object = {};
      const anotherObject = new Object();
      const notObject = null;

      expect(isObject(object)).toBe(true);
      expect(isObject(anotherObject)).toBe(true);
      expect(isObject(notObject)).toBe(false);
    });
  });

  describe('.random', () => {
    describe('given an Array as the first argument', () => {
      it('returns a sample of the Array', () => {
        const array = [-1, 0, 1];
        const sample = random(array);

        expect(array).toContain(sample);
      });
    });

    describe('given two integers', () => {
      it('returns a sample of the range between the two integers', () => {
        const firstArg = 3;
        const secondArg = 12;
        const sample = random(firstArg, secondArg);

        expect(greaterThanOrEqualTo(sample, firstArg)).toBe(true);
        expect(lessThanOrEqualTo(sample, secondArg)).toBe(true);
      });
    });
  });
});
