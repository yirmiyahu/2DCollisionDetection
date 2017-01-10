import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';

function debounce(func, wait, immediate) {
  if (!isFunction(func)) {
    return;
  }

  let timeout;

  return () => {
    const args = arguments;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    const callNow = immediate && !timeout;

    if (callNow) {
      func.apply(this, args);
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
  };
}

function inRangeInclusive(number, lower, upper) {
  if (isNumber(number) && isNumber(lower) && isNumber(upper) && upper > lower) {
    return number >= lower && number <= upper;
  }
}

function isHexColor(arg) {
  if (isString(arg)) {
    const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/i;
    return hexColorRegex.test(arg);
  }
}

export {
  debounce,
  inRangeInclusive,
  isHexColor
};
