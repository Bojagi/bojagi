// Questionmark is here to get around module replacement and load original module
const originalAddons = require('@storybook/addons?');

const makeDecorator = originalAddons.makeDecorator;
const getChannel = () => ({
  addListener: () => {},
  addPeerListener: () => {},
  emit: () => {},
  last: () => {},
  eventNames: () => {},
  listenerCount: () => {},
  listeners: () => {},
  once: () => {},
  removeAllListeners: () => {},
  removeListener: () => {},
  on: () => {},
  off: () => {},
});

const setConfig = () => {};

const addons = {
  makeDecorator,
  getChannel,
  setConfig,
};

module.exports.addons = addons;
module.exports.makeDecorator = makeDecorator;
module.exports.getChannel = getChannel;
module.exports.setConfig = setConfig;
