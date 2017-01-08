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

function inRange(number, lower, upper) {
  if (isNumber(number) && isNumber(lower) && isNumber(upper) && upper > lower) {
    return number >= lower && number <= upper;
  }
}

function isArray(arg) {
  return arg instanceof Array;
}

function isEmpty(arg) {
  if (isObject(arg)) {
    for (let key in arg) {
      if (arg.hasOwnProperty(key)) {
        return false;
      }
    }

    return true;
  }

  if (isArray(arg)) {
    return arg.length === 0;
  }

  return null;
}

function isFunction(arg) {
  return typeof arg === 'function';
}

function isHexColor(arg) {
  if (_isString(arg)) {
    const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/i;
    return hexColorRegex.test(arg);
  }
}

function _isString(arg) {
  return typeof arg === 'string';
}

function isNumber(arg) {
  return !isNaN(parseFloat(arg)) && isFinite(arg);
}

function isObject(arg) {
  return arg !== null && typeof arg === 'object';
}

function random(min, max) {
  if (isArray(min)) {
    return min[(Math.floor(Math.random() * min.length))];
  }

  if (!Number.isInteger(max)) {
    max = min || 1;
    min = 0;
  }

  return min + Math.floor(Math.random() * (max - min + 1));
}

export {
  debounce,
  inRange,
  isArray,
  isEmpty,
  isFunction,
  isHexColor,
  isNumber,
  isObject,
  random
};
