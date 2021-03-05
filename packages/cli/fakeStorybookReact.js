module.exports._decorators = [];
module.exports.addDecorator = (decoratorFn) => {module.exports._decorators.push(decoratorFn)}
module.exports.addParameters = () => {};
module.exports.getStorybook = () => [];
module.exports.raw = () => [];
module.exports.setAddon = () => {};
module.exports.storiesOf = () => {};
module.exports.forceReRender = () => {
  if (window && window.bojagi) {
    window.bojagi.forceReRender();
  }
};
module.exports.configure = () => {};
