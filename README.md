# Event Modulator

[![npm version](https://img.shields.io/npm/v/@danielhaim/event-modulator)](https://www.npmjs.com/package/@danielhaim/event-modulator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/@danielhaim/event-modulator.svg)](https://www.npmjs.com/package/@danielhaim/event-modulator)

Event Modulator is an advanced debouncing utility designed to optimize high-frequency events in web applications, such as scroll, resize, and input. This standalone solution surpasses other debouncing functions like Lodash and Underscore in terms of performance and flexibility. Key features include parameter validation, cache, and result storage, control over cache size, a maximum wait time, and a Promise-based return.

By incorporating a cache system for debounced function call results, Event Modulator allows users to control the cache size through the maxCacheSize parameter, optimizing performance and memory usage. The Promise-based return simplifies the handling and tracking of function call outcomes. Additionally, the module includes a cancel method for aborting the debounced function execution when necessary and a result method for retrieving the result of the last execution. These features provide enhanced control and flexibility for developers, making Event Modulator a superior choice for debouncing solutions in web applications.

## Demo

<a target="_blank" href="https://danielhaim1.github.io/event-modulator/"><img src="dist/demo.png" width="100%" height="auto"></a>

## Usage

The function can be imported and used in a Node.js environment using the following syntax:

```javascript
const { modulate } = require('./path/to/eventModulator');
```

Here's an example of how to use the modulate function:

```javascript
const originalFunc = () => {
  console.log('Original function called');
};

const debouncedFunc = modulate(originalFunc, 1000);

// Call the debounced function multiple times
debouncedFunc();
debouncedFunc();
debouncedFunc();
debouncedFunc();
debouncedFunc();
```

In the example above, `debouncedFunc` is a debounced version of `originalFunc`. The function `originalFunc` will be invoked no more than once every 1000 milliseconds (1 second).

## Usage in the Browser

The function can also be used in a browser environment by including the `event.modulator.browser.js` script in your HTML file:

```html
<script src="./path/to/event.modulator.browser.js"></script>
<script>window.modulate = modulate;</script>
```

After that, the `modulate` function can be accessed in your JavaScript code like this:

```javascript
const debouncedFunc = modulate(originalFunc, 1000);
```

## Options

The modulate function accepts the following parameters:

- `func`: The function to be debounced. Required.
- `wait`: The number of milliseconds to wait before invoking the function. Required.
- `immediate`: (optional) Whether to invoke the function on the leading edge (true) or trailing edge (false) of the wait interval. Defaults to false.
- `context`: (optional) The execution context to use for the function. Defaults to null.
- `maxCacheSize`: (optional) The maximum size of the cache that stores the results of the function calls. Defaults to 100.
- `maxWait`: (optional) The maximum wait time in milliseconds. If the time elapsed since the last function execution exceeds this value, the function will be executed immediately.

## Methods

The debounced function has two additional properties:

- `debounced.cancel()`: a method that can be called to cancel the debounced function execution.
- `debounced.result()`: a method that returns an array of the results of all executed invocations of the debounced function.

## Installation
You can install this module via npm:

```bash
npm i @danielhaim/event-modulator
```

## Example

```js
// Example function to be debounced
const originalFunc = (x, y) => {
  return x + y;
};

// Debounced version of originalFunc, with a maxWait time of 1000ms
const debouncedFunc = modulate(originalFunc, 1000);

// Call the debounced function multiple times with the same arguments
const promise1 = debouncedFunc(1, 2);
const promise2 = debouncedFunc(1, 2);
const promise3 = debouncedFunc(1, 2);

// Wait for the debounce time to pass
setTimeout(() => {
  Promise.all([promise1, promise2, promise3])
    .then(results => {
      console.log(results); // [3, 3, 3]
      console.log(debouncedFunc.result()); // [3]
    });
}, 2000);
```
In the example above, the function `originalFunc` returns the sum of two numbers. The debounced function is called three times with the same arguments, but it will only execute once after the wait time of 1000ms has passed. The `result` method returns the result of the last execution of the debounced function, which is `[3]`.

## Advanced

### Example: Debounced Function with Cache

Here's an example of creating a debounced version of a function `fetchData` with a cache size of 2. The debounced function `debouncedFetchData` is called multiple times with the same query ('apple' and 'banana'). Still, the original part is only invoked for the last two calls (one for 'apple' and one for 'banana'). After 1 second, the function is called again for 'apple' and 'banana,' and the results are retrieved from the cache instead of invoking the original function.

```js
const { modulate } = require('./eventModulator');

// Example function to fetch data
function fetchData(query) {
  console.log(`Fetching data for query: ${query}`);
  // Perform expensive operation, such as fetching from a server
  return Promise.resolve(`Data for "${query}"`);
}

// Debounced version of fetchData with cache size of 2
const debouncedFetchData = modulate(fetchData, 500, false, null, 2);

// Call debouncedFetchData multiple times with same query
debouncedFetchData('apple');
debouncedFetchData('apple');
debouncedFetchData('apple');
debouncedFetchData('banana');
debouncedFetchData('banana');

// Only the last 2 calls will invoke the original function after 1 second
setTimeout(() => {
  debouncedFetchData('apple');
  debouncedFetchData('banana');
}, 1000);
```

### maxCacheSize Parameter

The modulate function includes a `maxCacheSize` parameter that allows you to control the cache size of the debounced function. This parameter specifies the maximum number of function results that should be cached. Once the cache size is reached, the oldest result will be removed to accommodate the new result. If `maxCacheSize` is set to `null` or `undefined,` the cache will have unlimited size.

### Caching Results

In this example, the `memoize` function creates a cached version of a function to return the same result for the same arguments, improving performance by avoiding unnecessary function calls.

```js
// Create a new Map object to store the cache
const cache = new Map();

// Memoize function takes in a function as an argument
const memoize = func => {
  // Return a new function that takes any number of arguments
  return function (...args) {
    // Convert the arguments to a string to be used as a cache key
    const key = JSON.stringify(args);
    // Check if the result for the given arguments has already been cached
    if (cache.has(key)) {
      // If so, return the cached result
      return cache.get(key);
    }
    // Otherwise, call the original function with the given arguments
    const result = func(...args);
    // Cache the result and return it
    cache.set(key, result);
    return result;
  };
};

// Example function to be memoized
const originalFunc = x => x + 1;
// Memoized version of the function
const memoizedFunc = memoize(originalFunc);
// Call the memoized function three times with the same argument
const result1 = memoizedFunc(1);
const result2 = memoizedFunc(1);
const result3 = memoizedFunc(1);
```

## Tests

```
 PASS  src/eventModulator.test.js
  testing modulate
    ✓ should delay execution by maxWait time (1 ms)
    ✓ should cache results for the same arguments
    ✓ should throw an error if the first parameter is not a function (1 ms)
    ✓ should throw an error if the second parameter is not a number
    ✓ should throw an error if the third parameter is not a boolean
    ✓ should throw an error if the fifth parameter is not a number
    ✓ should throw an error if the sixth parameter is not a number or null (4 ms)
    ✓ should throw an error if the sixth parameter is less than the second parameter
    ✓ should return a debounced function
    ✓ should return the expected results
    ✓ should debounce the original function

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        0.184 s, estimated 1 s
```

## Resources

- [The Debouncing and Throttling Explained article on the CSS-Tricks website](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [The Underscore.js documentation on the debounce function](https://underscorejs.org/#debounce)
- [The Lodash documentation on the debounce function](https://lodash.com/docs/4.17.15#debounce)

## Report Bugs

If you encounter any bugs while using Modulator, please report them to the GitHub issue tracker.
When submitting a bug report, please include as much information as possible.
