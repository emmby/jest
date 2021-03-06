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

const Runtime = require('jest-runtime');

const wrap = require('jest-util').wrap;

const usage = 'Usage: $0 [--config=<pathToConfigFile>] [TestPathRegExp]';

const options = Object.assign({}, Runtime.getCLIOptions(), {
  replname: {
    alias: 'r',
    description: wrap(
    'The "name" of the file given to preprocessors to be transpiled. ' +
    'For example, "repl.ts" if using a Typescript preprocessor.'),

    type: 'string' } });



module.exports = {
  options,
  usage };