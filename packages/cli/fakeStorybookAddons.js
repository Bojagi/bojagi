const makeDecorator = () => story => story();
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
})

const addons = {
  makeDecorator,
  getChannel,
};

module.exports.addons = addons;
module.exports.makeDecorator = makeDecorator;
module.exports.getChannel = getChannel;
