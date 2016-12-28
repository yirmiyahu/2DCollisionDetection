function inRange(number, lower, upper) {
  return number >= lower && number <= upper;
}

function isNumber(arg) {
  return typeof arg === 'number';
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

function isObject(arg) {
  return arg !== null && typeof arg === 'object';
}

function isArray(arg) {
  return arg instanceof Array;
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

function debounce(func, wait, immediate) {
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

export { inRange, isNumber, isEmpty, isObject, isArray, random, debounce };
