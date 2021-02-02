import * as path from 'path';

export function pitch(remainingRequest) {
  // Change the request from an /abolute/path.js to a relative ./path.js
  // This prevents [chunkhash] values from changing when running webpack
  // builds in different directories.
  const newRequestPath = remainingRequest.replace(
    this.resourcePath,
    `.${path.sep}${path.relative(this.context, this.resourcePath)}`
  );
  if (this.cacheable) this.cacheable();
  if (!this.query) throw new Error('query parameter is missing');

  const moduleName = JSON.stringify(this.query.substr(1));
  const componentHubFn = 'registerComponent';
  const requirePath = JSON.stringify(`-!${newRequestPath}`);
  const result = `
    var componentModule = require(${requirePath});
    ${componentHubFn}(${moduleName}, componentModule);
    module.exports = componentModule;
  `;

  return result;
}
