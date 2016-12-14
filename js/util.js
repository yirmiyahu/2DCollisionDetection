function isNumber(numberOrNot) {
  return typeof numberOrNot === 'number';
}

function isEmpty(objectOrArrayOrNot) {
  if (isObject(objectOrArrayOrNot)) {
    for (let key in objectOrArrayOrNot) {
      if (objectOrArrayOrNot.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  if (isArray(objectOrArrayOrNot)) {
    return objectOrArrayOrNot.length === 0;
  }

  return null;
}

function isObject(objectOrNot) {
  return objectOrNot !== null && typeof objectOrNot === 'object';
}

function isArray(arrayOrNot) {
  return arrayOrNot instanceof Array;
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

export { isNumber, isEmpty, isObject, isArray, random };
