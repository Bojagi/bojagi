/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

import * as path from 'path';

function accesorString(value) {
  const childProperties = value.split('.');
  const { length } = childProperties;
  let propertyString = 'global';
  let result = '';

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    if (i > 0) result += `if(!${propertyString}) ${propertyString} = {};\n`;
    propertyString += `[${JSON.stringify(childProperties[i])}]`;
  }

  result += `module.exports = ${propertyString}`;
  return result;
}

// eslint-disable-next-line func-names
export const pitch = function(remainingRequest) {
  // Change the request from an /abolute/path.js to a relative ./path.js
  // This prevents [chunkhash] values from changing when running webpack
  // builds in different directories.
  const newRequestPath = remainingRequest.replace(
    this.resourcePath,
    `.${path.sep}${path.relative(this.context, this.resourcePath)}`
  );

  if (this.cacheable) {
    this.cacheable();
  }

  if (!this.query) throw new Error('query parameter is missing');
  /*
   * Workaround until module.libIdent() in webpack/webpack handles this correctly.
   *
   * fixes:
   * - https://github.com/webpack-contrib/expose-loader/issues/55
   * - https://github.com/webpack-contrib/expose-loader/issues/49
   */
  // eslint-disable-next-line no-underscore-dangle
  const originalUserRequest = this._module.userRequest;
  // eslint-disable-next-line no-underscore-dangle
  this._module.userRequest = `${originalUserRequest}-exposed`;
  const symbol =
    typeof this.query.symbol === 'function'
      ? this.query.symbol(originalUserRequest)
      : this.query.symbol;
  return `${accesorString(symbol)} = require(${JSON.stringify(`-!${newRequestPath}`)});`;
};
