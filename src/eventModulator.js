/**
 * modulate - Debounces a function and caches its results
 *
 * @param {function} func - The function to debounce
 * @param {number} wait - The debouncing wait time in milliseconds
 * @param {boolean} [immediate=false] - Flag to determine if the function should be executed immediately
 * @param {object} [context=null] - The context in which the function should be executed
 * @param {number} [maxCacheSize=100] - The maximum cache size
 * @param {number} [maxWait=null] - The maximum wait time in milliseconds
 *
 * @returns {function} The debounced function
 */

export function modulate(
  func,
  wait,
  immediate = false,
  context = null,
  maxCacheSize = 100,
  maxWait = null
) {

  // console.log('modulate called');
  // console.log('First parameter received: ', func);
  // console.log('Second parameter received: ', wait);
  // console.log('Third parameter received: ', immediate);
  // console.log('Fourth parameter received: ', context);
  // console.log('Fifth parameter received: ', maxCacheSize);
  // console.log('Sixth parameter received: ', maxWait);

  // ---------------------------------------- Parameter Validation ----------------------------------------
  if (typeof func !== "function") {
    throw new TypeError("Expected a function for the first parameter");
  }
  if (typeof wait !== "number" || isNaN(wait)) {
    throw new TypeError("Expected a number for the second parameter");
  }
  if (typeof wait !== "number" || isNaN(wait)) {
    throw new TypeError("Expected a number for the second parameter (wait)");
  }
  if (typeof immediate !== "boolean") {
    throw new TypeError("Expected a boolean for the third parameter");
  }
  if (typeof maxCacheSize !== "number" || isNaN(maxCacheSize)) {
    throw new TypeError("Expected a number for the fifth parameter");
  }
  if (maxWait !== null && (typeof maxWait !== "number" || isNaN(maxWait))) {
    throw new TypeError("Expected a number for the sixth parameter");
  }
  if (maxWait !== null && maxWait < wait) {
    throw new TypeError(
      "Expected the sixth parameter to be greater than or equal to the second parameter"
    );
  }

  // ---------------------------------------- Function Definition ----------------------------------------
  
  let timeout; // Stores the timeout ID
  let results = []; // Stores the results of the original function
  let cache = new Map(); // Stores the cached results of the original function
  let lastExecuted = 0; // Stores the timestamp of the last time the original function was executed
  let canceled = false; // Flag to track whether the function has been canceled

  const debounced = function executedFunction(...args) {
    return new Promise((resolve) => {

      function execute(func = () => { }, wait = 0, callNow = false, lastExecuted = 0) {

        // console.log('First parameter received: ', func);
        // console.log('Second parameter received: ', wait);
        // console.log('Third parameter received: ', callNow);
        // console.log('Fourth parameter received: ', lastExecuted);

        const timeSinceLast = Date.now() - lastExecuted;

        if (typeof func !== 'function') {
          return Promise.reject(new Error('Expected a function for the first parameter'));
        }
        if (typeof wait !== 'number' || isNaN(wait) || wait <= 0) {
          return Promise.reject(new Error('Expected a number for the second parameter'));
        }
        if (typeof timeSinceLast !== 'number' || isNaN(timeSinceLast) || timeSinceLast < 0) {
          return Promise.reject(new Error('Invalid timeSinceLast value'));
        }

        if (callNow || timeSinceLast >= wait || (maxWait !== null && timeSinceLast >= maxWait)) {
          func();
          return Promise.resolve(Date.now());
        }
        const remainingTime = wait - timeSinceLast;
        if (remainingTime <= 0) {
          return Promise.resolve(Date.now());
        }

        return new Promise((resolve) => setTimeout(() => resolve(Date.now()), remainingTime));
      }

      // Define the execution conditions
      const callNow = immediate && !timeout; // Check if we are in the first execution
      const timeSinceLast = Date.now() - lastExecuted; // Time since last execution
      const shouldExecute = maxWait !== null && timeSinceLast >= maxWait; // Check if the maximum wait time has been exceeded
      clearTimeout(timeout); // Clear the timeout
      if (shouldExecute) {
        timeout = setTimeout(execute, timeSinceLast);
      } else {
        timeout = setTimeout(() => execute(func, wait, callNow, lastExecuted), maxWait !== null ? maxWait : wait);


      }

      // Check if we should execute the function immediately
      if (callNow && !shouldExecute) {
        const result = func.apply(context, args); // Execute the function
        results.push(result); // Store the result
        cache.set(JSON.stringify(args), result); // Cache the result
        cache.size > maxCacheSize && cache.delete(cache.keys() // Remove the oldest entry if the cache size exceeds the maximum
          .next() // Get the first entry
          .value); // Get the key of the first entry
        resolve(result); // Resolve the promise
        lastExecuted = Date.now(); // Update the last executed timestamp
      }
      const cachedResult = cache.get(JSON.stringify(args)); // Check if the result is cached
      if (cachedResult !== undefined) {
        resolve(cachedResult); // Resolve the promise with the cached result
      }
    })
      .finally(() => {
        if (canceled) {
          results = []; // Clear the results
          cache.clear(); // Clear the cache
        }
        canceled = false; // Reset the canceled flag
      });
  };


  debounced.cancel = function () {
    clearTimeout(timeout); // Clear the timeout
    canceled = true; // Set the canceled flag
  };

  debounced.result = function () {
    return results; // Return the results
  };

  return debounced; // Return the debounced function
}

if (typeof module === 'object' && module.exports) {
  module.exports = {
    modulate
  };
}