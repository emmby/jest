/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */
'use strict';




const BaseReporter = require('./BaseReporter');

const chalk = require('chalk');
const clearLine = require('jest-util').clearLine;
const getConsoleOutput = require('./getConsoleOutput');
const getResultHeader = require('./getResultHeader');

const RUNNING_TEST_COLOR = chalk.bold.gray;
const TITLE_BULLET = chalk.bold('\u25cf ');

const pluralize = (word, count) => `${ count } ${ word }${ count === 1 ? '' : 's' }`;

class DefaultReporter extends BaseReporter {
  onRunStart(config, results) {
    this._printWaitingOn(results, config);
  }

  onTestResult(
  config,
  testResult,
  results)
  {
    this._clearWaitingOn(config);
    this._printTestFileSummary(config, testResult);
    this._printWaitingOn(results, config);
  }

  _printTestFileSummary(config, testResult) {
    this.log(getResultHeader(testResult, config));

    const consoleBuffer = testResult.console;
    if (consoleBuffer && consoleBuffer.length) {
      this._write(
      '  ' + TITLE_BULLET + 'Console\n\n' +
      getConsoleOutput(config.rootDir, config.verbose, consoleBuffer) + '\n');

    }

    if (testResult.failureMessage) {
      this._write(testResult.failureMessage + '\n');
    }
  }

  _clearWaitingOn(config) {
    clearLine(process.stderr);
  }

  _printWaitingOn(results, config) {
    const remaining = results.numTotalTestSuites -
    results.numPassedTestSuites -
    results.numFailedTestSuites -
    results.numRuntimeErrorTestSuites;
    if (process.stdout.isTTY && remaining > 0) {
      process.stderr.write(RUNNING_TEST_COLOR(
      `Running ${ pluralize('test suite', remaining) }...`));

    }
  }}


module.exports = DefaultReporter;