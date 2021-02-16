export function withMemo(fn, keyFn = defaultKeyFn) {
  const memos = {};

  return (...args) => {
    const key = keyFn(...args);
    if (!memos[key]) {
      memos[key] = fn(...args);
    }
    return memos[key];
  };
}

function defaultKeyFn(...args) {
  return args.map(arg => arg.toString()).join(':');
}
