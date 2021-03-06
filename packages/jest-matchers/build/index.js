/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';










const matchers = require('./matchers');
const spyMatchers = require('./spyMatchers');
const toThrowMatchers = require('./toThrowMatchers');var _require =

require('jest-matcher-utils');const stringify = _require.stringify;

const GLOBAL_MATCHERS_OBJECT_SYMBOL = Symbol.for('$$jest-matchers-object');

class JestAssertionError extends Error {}

if (!global[GLOBAL_MATCHERS_OBJECT_SYMBOL]) {
  Object.defineProperty(
  global,
  GLOBAL_MATCHERS_OBJECT_SYMBOL,
  { value: Object.create(null) });

}

const expect = actual => {
  const allMatchers = global[GLOBAL_MATCHERS_OBJECT_SYMBOL];
  const expectation = { not: {} };
  Object.keys(allMatchers).forEach(name => {
    expectation[name] =
    makeThrowingMatcher(allMatchers[name], false, actual);
    expectation.not[name] =
    makeThrowingMatcher(allMatchers[name], true, actual);
  });

  return expectation;
};

const makeThrowingMatcher = (
matcher,
isNot,
actual) =>
{
  return function throwingMatcher(expected, options) {
    const result = matcher(
    actual,
    expected,
    options,
    { args: arguments });


    _validateResult(result);

    if (result.pass && isNot || !result.pass && !isNot) {// XOR
      let message = result.message;

      // for performance reasons some of the messages are evaluated
      // lazily
      if (typeof message === 'function') {
        message = message();
      }

      const error = new JestAssertionError(message);
      // Remove this function from the stack trace frame.
      Error.captureStackTrace(error, throwingMatcher);
      throw error;
    }
  };
};

const addMatchers = matchersObj => {
  Object.assign(global[GLOBAL_MATCHERS_OBJECT_SYMBOL], matchersObj);
};

const _validateResult = result => {
  if (
  typeof result !== 'object' ||
  typeof result.pass !== 'boolean' ||
  !(
  typeof result.message === 'string' ||
  typeof result.message === 'function'))

  {
    throw new Error(
    'Unexpected return from a matcher function.\n' +
    'Matcher functions should ' +
    'return an object in the following format:\n' +
    '  {message: string | function, pass: boolean}\n' +
    `'${ stringify(result) }' was returned`);

  }
};

// add default jest matchers
addMatchers(matchers);
addMatchers(spyMatchers);
addMatchers(toThrowMatchers);

module.exports = {
  addMatchers,
  expect };