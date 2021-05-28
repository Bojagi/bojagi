const originalAddons = require('@storybook/addons');
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

const addons = {
  makeDecorator,
  getChannel,
};

module.exports.addons = addons;
module.exports.makeDecorator = makeDecorator;
module.exports.getChannel = getChannel;
