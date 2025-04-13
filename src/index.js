/**
 * Creates a debounced function with a configurable cache and maximum wait time. 
 * The debounced function delays invoking `func` until after `wait` milliseconds 
 * have elapsed since the last time the debounced function was invoked. 
 * The function also caches its results based on the arguments passed.
 * If `immediate` is true, it triggers the function on the leading edge, instead of the trailing.
 * 
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The debouncing wait time in milliseconds.
 * @param {boolean} [immediate=false] - Flag to determine if the function should be executed immediately.
 * @param {Object} [context=null] - The context in which the function should be executed.
 * @param {number} [maxCacheSize=100] - The maximum cache size for storing results.
 * @param {number|null} [maxWait=null] - The maximum wait time in milliseconds that the function can be delayed.
 * 
 * @returns {Function} A new debounced function that returns a Promise resolving with the result of `func`.
 *
 * @example
 * // Define a function to be debounced
 * async function fetchData(query) {
 *     console.log('Fetching data for:', query);
 *     // Simulate async operation
 *     await new Promise(resolve => setTimeout(resolve, 100));
 *     if (query === 'error') throw new Error('Failed to fetch');
 *     return `Data for ${query}`;
 * }
 * 
 * // Create a debounced version of the function
 * const debouncedFetch = modulate(fetchData, 200);
 * 
 * // Call the debounced function
 * debouncedFetch('query1').then(console.log).catch(console.error);
 * debouncedFetch('error').then(console.log).catch(console.error); // Will log error after delay
 */

export function modulate(
  func,
  wait,
  immediate = false,
  context = null,
  maxCacheSize = 100,
  maxWait = null
) {

  /**
   * console.log('modulate called');
   * console.log('First parameter received: ', func);
   * console.log('Second parameter received: ', wait);
   * console.log('Third parameter received: ', immediate);
   * console.log('Fourth parameter received: ', context);
   * console.log('Fifth parameter received: ', maxCacheSize);
   * console.log('Sixth parameter received: ', maxWait);
   */

  // Parameter Validation
  if (typeof func !== "function") {
    throw new TypeError("Expected a function for the first parameter");
  }
  if (typeof wait !== "number" || isNaN(wait) || wait < 0) {
    throw new TypeError("Expected a non-negative number for the second parameter (wait)");
  }
  if (typeof immediate !== "boolean") {
    throw new TypeError("Expected a boolean for the third parameter");
  }
  if (typeof maxCacheSize !== "number" || isNaN(maxCacheSize) || maxCacheSize < 0) {
    throw new TypeError("Expected a non-negative number for the fifth parameter (maxCacheSize)");
  }
  if (maxWait !== null && (typeof maxWait !== "number" || isNaN(maxWait) || maxWait < 0)) {
    throw new TypeError("Expected null or a non-negative number for the sixth parameter (maxWait)");
  }
  if (maxWait !== null && maxWait < wait) {
    throw new TypeError(
      "maxWait must be greater than or equal to wait"
    );
  }

  // State variables
  let timeoutId = null; // Stores the timeout ID
  let cache = new Map(); // Stores the cached results
  let lastCallTime = 0; // Timestamp of the last invocation of the debounced function
  let lastInvokeTime = 0; // Timestamp of the last execution of the original function
  let trailingArgs = null; // Arguments for the trailing edge call
  let trailingContext = null; // Context for the trailing edge call
  let trailingResolve = null; // Promise resolve function for trailing call
  let trailingReject = null; // Promise reject function for trailing call

  // Function to execute the original function
  const invokeFunc = (time, args, currentContext, resolve, reject) => {
    lastInvokeTime = time;
    try {
      const result = func.apply(currentContext, args);
      // Handle potential promises returned by func
      Promise.resolve(result).then(
        (value) => {
          if (maxCacheSize > 0) {
             const cacheKey = JSON.stringify(args); // Use stringify for simplicity here
             cache.set(cacheKey, value);
             // Evict oldest entry if cache exceeds size limit
             if (cache.size > maxCacheSize) {
                 cache.delete(cache.keys().next().value);
             }
          }
          resolve(value);
        },
        (error) => {
           reject(error); // Reject if the promise returned by func rejects
        }
      );
    } catch (error) {
      reject(error); // Reject if func throws synchronously
    }
  };

  // Function to handle the timer expiry
  const timerExpired = () => {
    const time = Date.now();
    // Should invoke if trailing call waiting and time criteria met
    const shouldInvoke = trailingArgs && (
        !maxWait || (time - lastCallTime >= maxWait) // Enough time passed since last call (maxWait)
        // Note: wait condition is implicitly handled by setting the timer
    );

    if (shouldInvoke) {
        invokeFunc(time, trailingArgs, trailingContext, trailingResolve, trailingReject);
    }
     // Reset state
    timeoutId = null;
    trailingArgs = null;
    trailingContext = null;
    trailingResolve = null;
    trailingReject = null;
 };


  // The debounced function returned to the user
  const debounced = function (...args) {
    return new Promise((resolve, reject) => {
      const time = Date.now();
      const isInvoking = !!timeoutId; // Is there already a pending timer?
      lastCallTime = time;
      const cacheKey = JSON.stringify(args); // Use stringify for simplicity

      // Return cached result if available
      if (maxCacheSize > 0 && cache.has(cacheKey)) {
        resolve(cache.get(cacheKey));
        return; // Don't proceed with debouncing if cached
      }

      // Determine if this is a leading edge call
      const callNow = immediate && !isInvoking;

      // Store args/context/promises for potential trailing call
      trailingArgs = args;
      trailingContext = context || this; // Use provided context or function's 'this'
      trailingResolve = resolve;
      trailingReject = reject;

      if (callNow) {
        // Invoke immediately
        invokeFunc(time, args, trailingContext, resolve, reject);
        // Start the timer for the cooldown period after immediate invocation
        timeoutId = setTimeout(timerExpired, wait);
      } else {
        // Reset the timer for a trailing edge call or subsequent calls
        clearTimeout(timeoutId);
        const timeSinceLastInvoke = time - lastInvokeTime;
        const remainingWait = wait - (time - lastCallTime); // Should be time since *this* call started waiting
        const timeUntilInvoke = maxWait === null
            ? wait // Standard wait time
            : Math.min(wait, maxWait - timeSinceLastInvoke); // Consider maxWait limit

        timeoutId = setTimeout(timerExpired, timeUntilInvoke > 0 ? timeUntilInvoke : 0);
      }
    });
  };

  // Cancel method
  debounced.cancel = function () {
    clearTimeout(timeoutId);
    lastInvokeTime = 0;
    timeoutId = null;
    trailingArgs = null;
    trailingContext = null;
    // Reject any pending promise if cancelled
    if (trailingReject) {
        trailingReject(new Error('Debounced function call was cancelled.'));
    }
    trailingResolve = null;
    trailingReject = null;
    // Optionally clear cache on cancel? debated. Let's leave cache intact.
    // cache.clear();
  };

  // Flush method (Optional - Add later if needed)
  // debounced.flush = function() { ... }

  return debounced; // Return the debounced function
}