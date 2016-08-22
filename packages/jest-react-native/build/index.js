/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';
/* global jest */

jest.
mock('ImageViewManager', () => ({
  prefetchImage: jest.fn(),
  getSize: jest.fn((uri, success, failure) =>
  process.nextTick(() => success(320, 240))) }),

{ virtual: true }).
mock('Image', () => {
  const realImage = require.requireActual('Image');
  const React = require('React');
  class Image extends React.Component {
    render() {
      return React.createElement('Image', this.props, this.props.children);
    }}const


  getSize = realImage.getSize;const prefetch = realImage.prefetch;const propTypes = realImage.propTypes;const resizeMode = realImage.resizeMode;

  Object.assign(Image, {
    getSize,
    prefetch,
    propTypes,
    resizeMode });


  return Image;
}).
mock('Text', () => {
  const realText = require.requireActual('Text');
  const React = require('React');
  class Text extends React.Component {
    render() {
      return React.createElement('Text', this.props, this.props.children);
    }}

  Text.propTypes = realText.propTypes;
  return Text;
}).
mock('ReactNativeDefaultInjection').
mock('View').
mock('ensureComponentIsNative', () => () => true);

global.__DEV__ = true;
global.__fbBatchedBridgeConfig = require('./bridge-mock');var _require =

require('whatwg-fetch');const Response = _require.Response;const Request = _require.Request;const Headers = _require.Headers;const fetch = _require.fetch;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = fetch;

require(
'react-native/packager/react-packager/src/Resolver/polyfills/Object.es7');

require(
'react-native/packager/react-packager/src/Resolver/polyfills/error-guard');


const mockEmptyObject = {};
jest.mock('ReactNativePropRegistry', () => ({
  register: id => id,
  getByID: () => mockEmptyObject }));