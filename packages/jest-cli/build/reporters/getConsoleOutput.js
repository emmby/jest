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



const chalk = require('chalk');
const path = require('path');

module.exports = (root, verbose, buffer) => {
  const TITLE_INDENT = verbose ? '  ' : '    ';
  const CONSOLE_INDENT = TITLE_INDENT + '  ';

  return buffer.reduce((output, _ref) => {let type = _ref.type;let message = _ref.message;let origin = _ref.origin;
    origin = path.relative(root, origin);
    message = message.
    split(/\n/).
    map(line => CONSOLE_INDENT + line).
    join('\n');

    let typeMessage = 'console.' + type;
    if (type === 'warn') {
      message = chalk.yellow(message);
      typeMessage = chalk.yellow(typeMessage);
    } else if (type === 'error') {
      message = chalk.red(message);
      typeMessage = chalk.red(typeMessage);
    }

    return (
      output + TITLE_INDENT + chalk.dim(typeMessage) +
      ' ' + chalk.gray(origin) + '\n' + message + '\n');

  }, '');
};