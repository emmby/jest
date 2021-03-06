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





const DependencyResolver = require('jest-resolve-dependencies');

const chalk = require('chalk');
const changedFiles = require('jest-changed-files');
const fileExists = require('jest-file-exists');
const path = require('path');
const utils = require('jest-util');




























const git = changedFiles.git;
const hg = changedFiles.hg;

const determineSCM = path => Promise.all([
git.isGitRepository(path),
hg.isHGRepository(path)]);

const pathToRegex = p => utils.replacePathSepForRegex(p);
const pluralize = (
word,
count,
ending) =>
`${ count } ${ word }${ count === 1 ? '' : ending }`;

class SearchSource {












  constructor(
  hasteMap,
  config,
  options)
  {
    this._hasteContext = hasteMap;
    this._config = config;
    this._options = options || {};

    this._testPathDirPattern =
    new RegExp(config.testPathDirs.map(dir => {
      return pathToRegex(utils.escapeStrForRegex(dir));
    }).join('|'));
    this._testRegex = new RegExp(pathToRegex(config.testRegex));
    const ignorePattern = config.testPathIgnorePatterns;
    this._testIgnorePattern =
    ignorePattern.length ? new RegExp(ignorePattern.join('|')) : null;

    this._testPathCases = {
      testPathDirs: path => this._testPathDirPattern.test(path),
      testRegex: path => this._testRegex.test(path),
      testPathIgnorePatterns: path =>
      !this._testIgnorePattern ||
      !this._testIgnorePattern.test(path) };


  }

  _filterTestPathsWithStats(
  allPaths,
  testPathPattern)
  {
    const data = {
      paths: [],
      stats: {},
      total: allPaths.length };


    const testCases = Object.assign({}, this._testPathCases);
    if (testPathPattern) {
      const regex = new RegExp(testPathPattern);
      testCases.testPathPattern =
      path => regex.test(path);
    }

    data.paths = allPaths.filter(path => {
      return Object.keys(testCases).reduce((flag, key) => {
        if (testCases[key](path)) {
          data.stats[key] = ++data.stats[key] || 1;
          return flag && true;
        }
        data.stats[key] = data.stats[key] || 0;
        return false;
      }, true);
    });

    return data;
  }

  _getAllTestPaths(
  testPathPattern)
  {
    return this._filterTestPathsWithStats(
    this._hasteContext.hasteFS.getAllFiles(),
    testPathPattern);

  }

  isTestFilePath(path) {
    return Object.keys(this._testPathCases).every(key =>
    this._testPathCases[key](path));

  }

  findMatchingTests(
  testPathPattern)
  {
    if (testPathPattern && !(testPathPattern instanceof RegExp)) {
      const maybeFile = path.resolve(process.cwd(), testPathPattern);
      if (fileExists(maybeFile, this._hasteContext.hasteFS)) {
        return this._filterTestPathsWithStats([maybeFile]);
      }
    }

    return this._getAllTestPaths(testPathPattern);
  }

  findRelatedTests(allPaths) {
    const dependencyResolver = new DependencyResolver(
    this._hasteContext.resolver,
    this._hasteContext.hasteFS);

    return {
      paths: dependencyResolver.resolveInverse(
      allPaths,
      this.isTestFilePath.bind(this),
      {
        skipNodeResolution: this._options.skipNodeResolution }) };



  }

  findChangedTests(options) {
    return Promise.all(this._config.testPathDirs.map(determineSCM)).
    then(repos => {
      if (!repos.every(result => result[0] || result[1])) {
        throw new Error(
        'It appears that one of your testPathDirs does not exist ' +
        'within a git or hg repository. Currently `--onlyChanged` ' +
        'only works with git or hg projects.');

      }
      return Promise.all(Array.from(repos).map(repo => {
        return repo[0] ?
        git.findChangedFiles(repo[0], options) :
        hg.findChangedFiles(repo[1], options);
      }));
    }).
    then(changedPathSets => this.findRelatedTests(
    new Set(Array.prototype.concat.apply([], changedPathSets))));

  }

  getNoTestsFoundMessage(
  patternInfo,
  config,
  data)
  {
    if (patternInfo.onlyChanged) {
      const guide = patternInfo.watch ?
      'starting Jest with `jest --watch=all`' :
      'running Jest without `-o`';
      return 'No tests found related to changed and uncommitted files.\n' +
      'Note: If you are using dynamic `require`-calls or no tests related ' +
      'to your changed files can be found, consider ' + guide + '.';
    }

    const pattern = patternInfo.testPathPattern;
    const input = patternInfo.input;
    const formattedPattern = `/${ pattern || '' }/`;
    const formattedInput = patternInfo.shouldTreatInputAsPattern ?
    `/${ input || '' }/` :
    `"${ input || '' }"`;
    const testPathPattern =
    input === pattern ? formattedInput : formattedPattern;

    const stats = data.stats || {};
    const statsMessage = Object.keys(stats).map(key => {
      const value = key === 'testPathPattern' ? testPathPattern : config[key];
      if (value) {
        const matches = pluralize('match', stats[key], 'es');
        return `  ${ key }: ${ chalk.yellow(value) } - ${ matches }`;
      }
      return null;
    }).filter(line => line).join('\n');

    return (
      `${ chalk.bold.red('NO TESTS FOUND') }. ` + (
      data.total ?
      `${ pluralize('file', data.total || 0, 's') } checked.\n${ statsMessage }` :
      `No files found in ${ config.rootDir }.\n` +
      `Make sure Jest's configuration does not exclude this directory.`));


  }

  getTestPaths(patternInfo) {
    if (patternInfo.onlyChanged) {
      return this.findChangedTests({ lastCommit: patternInfo.lastCommit });
    } else if (patternInfo.testPathPattern != null) {
      return Promise.resolve(
      this.findMatchingTests(patternInfo.testPathPattern));

    } else {
      return Promise.resolve({ paths: [] });
    }
  }}



module.exports = SearchSource;