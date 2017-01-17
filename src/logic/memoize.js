export default function memoize(fn) {
  const cache = {};
  const hash = JSON.stringify;
  return function memoized(...args) {
    const key = hash(args);
    if (!cache[key]) cache[key] = fn.call(null, ...args);
    return cache[key];
  };
}
