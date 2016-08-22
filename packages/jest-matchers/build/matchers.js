/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
/* eslint-disable max-len */

'use strict';



const diff = require('jest-diff');var _require =
require('jest-util');const escapeStrForRegex = _require.escapeStrForRegex;var _require2 =





require('jest-matcher-utils');const ensureNoExpected = _require2.ensureNoExpected;const ensureNumbers = _require2.ensureNumbers;const highlight = _require2.highlight;const printExpected = _require2.printExpected;

const equals = global.jasmine.matchersUtil.equals;

const hasIterator = object => !!(object != null && object[Symbol.iterator]);
const iterableEquality = (a, b) => {
  if (
  typeof a !== 'object' ||
  typeof b !== 'object' ||
  Array.isArray(a) ||
  Array.isArray(b) ||
  !hasIterator(a) ||
  !hasIterator(b))
  {
    return undefined;
  }
  if (a.constructor !== b.constructor) {
    return false;
  }
  const bIterator = b[Symbol.iterator]();

  for (const aValue of a) {
    const nextB = bIterator.next();
    if (
    nextB.done ||
    !global.jasmine.matchersUtil.equals(
    aValue,
    nextB.value,
    [iterableEquality]))

    {
      return false;
    }
  }
  if (!bIterator.next().done) {
    return false;
  }
  return true;
};

const matchers = {
  toBe(actual, expected) {
    const pass = actual === expected;

    if (pass) {
      return {
        pass,
        message() {
          return `Received ${ highlight(actual) } but expected it not to ` +
          `be ${ printExpected(expected) }  (using '!==').`;
        } };

    } else {
      return {
        pass,
        message() {
          const diffString = diff(expected, actual);
          return `Received ${ highlight(actual) } but expected ` +
          `${ printExpected(expected) } (using '===').` + (
          diffString ? '\n\n' + diffString : '');
        } };

    }
  },

  toEqual(actual, expected) {
    const pass = equals(actual, expected, [iterableEquality]);

    if (pass) {
      return {
        pass,
        message() {
          return `Received ${ highlight(actual) } but expected it not `
          `to equal ${ printExpected(expected) }.`;
        } };

    } else {
      return {
        pass,
        message() {
          const diffString = diff(expected, actual);
          return `Received ${ highlight(actual) } but expected it to equal ` +
          `${ printExpected(expected) }.` + (diffString ? '\n\n' + diffString : '');
        } };

    }
  },

  toBeTruthy(actual, expected) {
    ensureNoExpected(expected, 'toBeTruthy');
    const pass = !!actual;
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it to be truthy.` :
    () => `Received ${ highlight(actual) } but expected it not to be truthy.`;

    return { message, pass };
  },

  toBeFalsy(actual, expected) {
    ensureNoExpected(expected, 'toBeFalsy');
    const pass = !actual;
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to be falsy.` :
    () => `Received ${ highlight(actual) } but expected it to be falsy.`;

    return { message, pass };
  },

  toBeNaN(actual, expected) {
    ensureNoExpected(expected, 'toBeNaN');
    const pass = Number.isNaN(actual);
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to be NaN.` :
    () => `Received ${ highlight(actual) } but expected it to be NaN.`;

    return { message, pass };
  },

  toBeNull(actual, expected) {
    ensureNoExpected(expected, 'toBeNull');
    const pass = actual === null;
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to be null.` :
    () => `Received ${ highlight(actual) } but expected it to be null.`;

    return { message, pass };
  },

  toBeDefined(actual, expected) {
    ensureNoExpected(expected, 'toBeDefined');
    const pass = actual !== void 0;
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to be defined.` :
    () => `Received ${ highlight(actual) } but expected it to be defined.`;

    return { message, pass };
  },

  toBeUndefined(actual, expected) {
    ensureNoExpected(expected, 'toBeUndefined');
    const pass = actual === void 0;
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to be undefined.` :
    () => `Received ${ highlight(actual) } but expected it to be undefined.`;

    return { message, pass };
  },

  toBeGreaterThan(actual, expected) {
    ensureNumbers(actual, expected, '.toBeGreaterThan');
    const pass = actual > expected;
    const message = pass ?
    `Received ${ highlight(actual) } but expected it not to be greater than ${ printExpected(expected) } (using >.)` :
    `Received ${ highlight(actual) } but expected it to be greater than ${ printExpected(expected) } (using >).`;
    return { message, pass };
  },

  toBeGreaterThanOrEqual(actual, expected) {
    ensureNumbers(actual, expected, '.toBeGreaterThanOrEqual');
    const pass = actual >= expected;
    const message = pass ?
    `Received ${ highlight(actual) } but expected it not to be greater than or equal ${ printExpected(expected) } (using >=).` :
    `Received ${ highlight(actual) } but expected it to be greater than or equal ${ printExpected(expected) } (using >=).`;
    return { message, pass };
  },

  toBeLessThan(actual, expected) {
    ensureNumbers(actual, expected, '.toBeLessThan');
    const pass = actual < expected;
    const message = pass ?
    `Received ${ highlight(actual) } but expected it not to be less than ${ printExpected(expected) } (using <).` :
    `Received ${ highlight(actual) } but expected it to be less than ${ printExpected(expected) } (using <).`;
    return { message, pass };
  },

  toBeLessThanOrEqual(actual, expected) {
    ensureNumbers(actual, expected, '.toBeLessThanOrEqual');
    const pass = actual <= expected;
    const message = pass ?
    `Received ${ highlight(actual) } but expected it not to be less than or equal ${ printExpected(expected) } (using <=).` :
    `Received ${ highlight(actual) } but expected it to be less than or equal ${ printExpected(expected) } (using <=).`;
    return { message, pass };
  },

  toContain(actual, expected) {
    if (!Array.isArray(actual) && typeof actual !== 'string') {
      throw new Error(
      `.toContain() only works with arrays and strings. ${ typeof actual }: ${ highlight(actual) } was passed.`);

    }

    const pass = actual.indexOf(expected) != -1;
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to contain ${ printExpected(expected) }.` :
    () => `Received ${ highlight(actual) } but expected it to contain ${ printExpected(expected) }.`;

    return { message, pass };
  },

  toBeCloseTo(actual, expected) {let precision = arguments.length <= 2 || arguments[2] === undefined ? 2 : arguments[2];
    ensureNumbers(actual, expected, '.toBeCloseTo');
    const pass = Math.abs(expected - actual) < Math.pow(10, -precision) / 2;
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to be close to ${ printExpected(expected) } with ${ printExpected(precision) }-digit precision.` :
    () => `Received ${ highlight(actual) } but expected it to be close to ${ printExpected(expected) } with ${ printExpected(precision) }-digit precision.`;

    return { message, pass };
  },

  toMatch(actual, expected) {
    if (typeof actual !== 'string') {
      return {
        pass: false,
        message: `Received ${ highlight(actual) } and expected it to be a string.` };

    }

    const isString = typeof expected == 'string';
    if (!(expected instanceof RegExp) && !isString) {
      return {
        pass: false,
        message: `Expected ${ printExpected(expected) } to be a string or regular expression.` };

    }

    const pass = new RegExp(isString ? escapeStrForRegex(expected) : expected).
    test(actual);
    const message = pass ?
    () => `Received ${ highlight(actual) } but expected it not to match ${ printExpected(expected) }.` :
    () => `Received ${ highlight(actual) } but expected it to match ${ printExpected(expected) }.`;

    return { message, pass };
  } };


module.exports = matchers;