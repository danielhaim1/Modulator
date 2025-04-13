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

// Define interfaces and types
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

type TimerId = ReturnType<typeof setTimeout> | null;

// Define the structure of the debounced function, including the cancel method
interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel(): void;
  // flush(): Promise<ReturnType<T> | undefined>; // Add later if implementing flush
}

export function modulate<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false,
  context: ThisParameterType<T> | null = null,
  maxCacheSize: number = 100,
  maxWait: number | null = null
): DebouncedFunction<T> {

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

  let timeoutId: TimerId = null;
  let cache = new Map<string, ReturnType<T>>();
  let cacheKeys: string[] = [];

  // State related to the *last* call attempt
  let lastArgs: Parameters<T> | null = null; // Args from the last call
  let lastThis: ThisParameterType<T> | null = null; // Context from the last call
  let lastCallTime: number = 0; // Time of the last call

  // State related to the *last actual function invocation*
  let lastInvokeTime: number = 0;

  // State for the promise of the current debounce sequence
  let sequencePromise: Promise<ReturnType<T>> | null = null;
  let sequenceResolve: ((value: ReturnType<T> | PromiseLike<ReturnType<T>>) => void) | null = null;
  let sequenceReject: ((reason?: any) => void) | null = null;

  // Helper Functions

  // Clear cache entry and its key tracking
  const clearCacheEntry = (key: string) => {
      cache.delete(key);
      const index = cacheKeys.indexOf(key);
      if (index > -1) {
          cacheKeys.splice(index, 1);
      }
  }

  // Add to cache and handle eviction
  const addToCache = (key: string, value: ReturnType<T>) => {
      if (maxCacheSize <= 0) return; // Caching disabled

      if (!cache.has(key)) {
           // Evict oldest if size exceeded
           if (cache.size >= maxCacheSize) {
               const oldestKey = cacheKeys.shift(); // Remove oldest key from tracking
               if (oldestKey) {
                  cache.delete(oldestKey); // Remove from cache map
               }
           }
           cacheKeys.push(key); // Add new key to tracking
      } else {
           // Refresh key position if it exists (treat as most recently used)
           const index = cacheKeys.indexOf(key);
           if (index > -1) {
              cacheKeys.splice(index, 1);
              cacheKeys.push(key);
           }
      }
      cache.set(key, value);
  }

  // Invokes the target function and resolves/rejects the sequence promise
  const invokeFuncAndResolve = (
      args: Parameters<T>,
      ctx: ThisParameterType<T> | null
  ) => {
    const invokeTime = Date.now();
    lastInvokeTime = invokeTime; // Record invocation time

    // Capture promise handlers before potential async operations clear them
    const resolve = sequenceResolve;
    const reject = sequenceReject;

    // Reset sequence promise state immediately *before* calling func
    sequencePromise = null;
    sequenceResolve = null;
    sequenceReject = null;

    try {
      const effectiveContext = context ?? ctx ?? null;
      const result = func.apply(effectiveContext as ThisParameterType<T>, args);

      Promise.resolve(result).then(
        (value) => {
          const cacheKey = JSON.stringify(args);
          addToCache(cacheKey, value);
          if (resolve) { resolve(value); }
        },
        (error) => {
          if (reject) { reject(error); }
        }
      );
    } catch (error) {
      if (reject) { reject(error); }
    }
  };

  // Timer callback for the trailing edge
  const trailingEdgeCallback = () => {
    timeoutId = null; // Timer done

    // Invoke only if enough time passed since the last call (standard wait)
    // AND maxWait condition (if applicable) is met relative to last *invocation*
    const time = Date.now();
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    let shouldInvoke = timeSinceLastCall >= wait;

    if (shouldInvoke && maxWait !== null) {
         // If maxWait is set, we only *really* invoke if maxWait time has passed since last invoke
         // (The timer delay already accounted for the minimum wait)
         // This handles the case where the timer was set based on maxWait, but we might have been called again since.
         // Re-evaluate: This check might be redundant if the delay calculation is correct.
         // Let's simplify: if the timer fires, the conditions were met when it was *set*.
    }

    if (lastArgs) { // Ensure we have args to invoke with
        invokeFuncAndResolve(lastArgs, lastThis);
    }
     // else: Should not happen if timer was set correctly with args stored
  };

  // Timer callback for when cooldown period ends (does nothing)
  const cooldownCallback = () => {
    timeoutId = null; // Cooldown timer is done
    // If a call came during cooldown, its trailing timer should already be set.
  };

  // --- The Debounced Function ---
  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>): Promise<ReturnType<T>> {
    const time = Date.now();
    lastCallTime = time; // Record time of this call
    lastArgs = args; // Store args & context from *this* call
    lastThis = context ?? this;

    // --- Cache Check ---
    const cacheKey = JSON.stringify(args);
    if (maxCacheSize > 0 && cache.has(cacheKey)) {
      const index = cacheKeys.indexOf(cacheKey);
      if (index > -1) { cacheKeys.splice(index, 1); cacheKeys.push(cacheKey); }
      return Promise.resolve(cache.get(cacheKey)!); // Return cached value immediately
    }

    // --- Determine invocation strategy ---
    const isTimerRunning = !!timeoutId;
    const shouldCallNow = immediate && !isTimerRunning; // Only immediate if no timer is active

    // --- Promise Handling ---
    // Reuse or create a promise for this sequence
    if (!sequencePromise) {
       sequencePromise = new Promise((resolve, reject) => {
          sequenceResolve = resolve;
          sequenceReject = reject;
       });
    }
    const currentSequencePromise = sequencePromise; // Capture for return

    // --- Timer Management ---
    if (timeoutId) { // Clear any existing timer
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (shouldCallNow) {
      // --- Immediate Invocation ---
      invokeFuncAndResolve(args, lastThis);
      // Set cooldown timer - does nothing on expiry, just blocks immediate calls
      timeoutId = setTimeout(cooldownCallback, wait);
    } else {
      // --- Delayed (Trailing) Invocation ---
      // Calculate delay based on 'wait' and 'maxWait'
      let delay = wait;
      if (maxWait !== null) {
           const timeSinceInvoke = time - lastInvokeTime;
           // Time until maxWait would expire from last successful invocation
           const timeUntilMaxWait = maxWait - timeSinceInvoke;

           // We should invoke after 'delay' ms OR when maxWait is hit, whichever is sooner.
           // But the delay should not be *less* than the remaining standard wait time.
           // Wait time remaining based on *this* call: wait - (time - lastCallTime) is complex.
           // Simpler: Use standard wait, but bounded by maxWait limit from last invoke.
           if (timeUntilMaxWait < delay) {
              delay = timeUntilMaxWait > 0 ? timeUntilMaxWait : 0;
           }
      }
       // Ensure delay isn't negative if clocks/times are weird
       delay = Math.max(0, delay);

      // Set trailing edge timer
      timeoutId = setTimeout(trailingEdgeCallback, delay);
    }

    return currentSequencePromise; // Return the promise for this sequence

  } as DebouncedFunction<T>;

  // --- Cancel Method ---
  debounced.cancel = function () {
    if (timeoutId) { clearTimeout(timeoutId); }
    lastInvokeTime = 0; // Reset invoke time to allow immediate next time
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
    // Reject the pending sequence promise, if it exists
    if (sequenceReject) {
      sequenceReject(new Error('Debounced function call was cancelled.'));
    }
    sequencePromise = null;
    sequenceResolve = null;
    sequenceReject = null;
  };

  return debounced;
}