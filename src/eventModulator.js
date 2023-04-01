/**
 * Creates a debounced version of a function that delays invoking the original
 * function until after a certain amount of time has passed since the last time
 * the debounced function was invoked.
 *
 * @param {Function} func - The function to be debounced.
 * @param {number} wait - The number of milliseconds to wait before invoking the function.
 * @param {boolean} [immediate=false] - Whether to invoke the function on the leading edge (true) or trailing edge (false) of the wait interval.
 * @param {Object} [context=null] - The execution context to use for the function.
 * @param {number} [maxCacheSize=100] - The maximum size of the cache to store function results. If the cache size exceeds this value, the oldest entry will be removed.
 * @returns {Function} The debounced version of the original function.
 *
 * @throws {TypeError} If the first parameter is not a function, or the second parameter is not a number.
 */

export function modulate(func, wait, immediate = false, context = null, maxCacheSize = 100) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  if (typeof wait !== 'number' || isNaN(wait)) {
    throw new TypeError('Expected a number for the wait time');
  }

  let timeout;
  let results = [];
  let cache = new Map();

  const debounced = function executedFunction(...args) {
    return new Promise((resolve) => {
      const execute = function () {
        const result = func.apply(context, args);
        results.push(result);
        cache.set(JSON.stringify(args), result);

        // Remove oldest entry if cache has reached maximum size
        if (cache.size > maxCacheSize) {
          const oldestKey = cache.keys().next().value;
          cache.delete(oldestKey);
        }

        resolve(result);
        timeout = null;
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(execute, wait);

      if (callNow) {
        const result = func.apply(context, args);
        results.push(result);
        cache.set(JSON.stringify(args), result);

        // Remove oldest entry if cache has reached maximum size
        if (cache.size > maxCacheSize) {
          const oldestKey = cache.keys().next().value;
          cache.delete(oldestKey);
        }

        resolve(result);
      }

      // Check cache for result
      const cachedResult = cache.get(JSON.stringify(args));
      if (cachedResult !== undefined) {
        resolve(cachedResult);
      }
    });
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
  };

  debounced.result = function () {
    return results;
  };

  return debounced;
}


if (typeof module === 'object' && module.exports) {
  module.exports = { modulate };
}

