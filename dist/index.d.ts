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
interface DebouncedFunction<T extends (...args: any[]) => any> {
    (...args: Parameters<T>): Promise<ReturnType<T>>;
    cancel(): void;
}
export declare function modulate<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean, context?: ThisParameterType<T> | null, maxCacheSize?: number, maxWait?: number | null): DebouncedFunction<T>;
export {};
//# sourceMappingURL=index.d.ts.map