import {
  debounce,
  inRangeInclusive,
  isHexColor,
} from 'util';

import gte from 'lodash/gte';
import lte from 'lodash/lte';

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

  describe('.inRangeInclusive', () => {
    it('verifies whether the passed number is between the passed lower and upper bounds', () => {
      const lower = 0;
      const number = 1;
      const upper = 2;

      expect(inRangeInclusive(number, lower, upper)).toBe(true);
    });

    it('returns undefined if either of the arguments is not a number', () => {
      const lower = null;
      const number = 1;
      const upper = 2;

      expect(inRangeInclusive(number, lower, upper)).toBeUndefined();
    });

    it('returns undefined if the upper bound is not greater than the lower', () => {
      const lower = 3;
      const number = 1;
      const upper = 2;

      expect(inRangeInclusive(number, lower, upper)).toBeUndefined();
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
});
