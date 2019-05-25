const extendedJestFnFactory = ({ jestFn }) => cb => {
  let extendedCb;
  const callPromise = new Promise(resolve => {
    extendedCb = (...args) => {
      const returnValue = cb(...args);
      resolve({
        args,
        returnValue
      });
      return returnValue;
    };
  });

  const mock = jestFn(extendedCb);
  mock.mock.callPromise = callPromise;

  return mock;
};

export default extendedJestFnFactory;
