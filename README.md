Modulator
=========

[![npm version](https://img.shields.io/npm/v/@danielhaim/modulator)](https://www.npmjs.com/package/@danielhaim/modulator)
[![Downloads](https://img.shields.io/npm/dt/@danielhaim/modulator.svg)](https://www.npmjs.com/package/@danielhaim/modulator)
![GitHub](https://img.shields.io/github/license/danielhaim1/modulator)

Modulator is an advanced debouncing utility designed to optimize high-frequency events in web applications, such as scroll, resize, and input. This standalone solution surpasses other debouncing functions like Lodash and Underscore in terms of performance and flexibility. Key features include parameter validation, cache, and result storage, control over cache size, a maximum wait time, and a Promise-based return.

By incorporating a cache system for debounced function call results, Modulator allows users to control the cache size through the maxCacheSize parameter, optimizing performance and memory usage. The Promise-based return simplifies the handling and tracking of function call outcomes. Additionally, the module includes a cancel method for aborting the debounced function execution when necessary and a result method for retrieving the result of the last execution. These features provide enhanced control and flexibility for developers, making Modulator a superior choice for debouncing solutions in web applications.

## Demo ##

<a target="_blank" href="https://danielhaim1.github.io/Modulator/"><img src="https://raw.githubusercontent.com/danielhaim1/Modulator/main/docs/assets/demo.png" width="100%" height="auto" alt="Modulator Demo"></a>

API Documentation
-----------------

To initiate, install `Modulator` using NPM:

```bash
npm i @danielhaim/modulator
```

### Module Example ###

```js
import Modulator from "./path/to/danielhaim/modulator";
// CDN → import Modulator from "https://esm.sh/@danielhaim/modulator"

Modulator.modulate(func, wait, immediateopt, contextopt, maxCacheSizeopt, maxWaitopt) → {function}
```

### `Modulator.modulate()` ###

Creates a debounced function with a configurable cache and maximum wait time. The debounced function delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked. The function also caches its results based on the arguments passed. If `immediate` is true, it triggers the function on the leading edge, instead of the trailing.

### Parameters ###

|Name|Type|Attributes|Default|Description|
|--- |--- |--- |--- |--- |
|`func`|function|||The function to debounce.|
|`wait`|number|||The debouncing wait time in milliseconds.|
|`immediate`|boolean|`<optional>`|false|Flag to determine if the function should be executed immediately.|
|`context`|Object|`<optional>`|null|The context in which the function should be executed.|
|`maxCacheSize`|number|`<optional>`|100|The maximum cache size for storing results.|
|`maxWait`|number|null|`<optional>`|null|The maximum wait time in milliseconds that the function can be delayed.|

### Enhanced Functionality ###

Once you create a debounced function using `modulate`, it comes with additional methods that enhance its capabilities:

- `debounced.cancel()`: Cancels the execution of the debounced function. This is useful if you need to prevent the function from being called if certain conditions are met.
- `debounced.result()`: Returns an array of the results from all the invocations of the debounced function. It provides a way to access the outcomes of the function calls, especially useful when dealing with asynchronous operations.

These methods provide greater control and flexibility in managing the debounced function, allowing for more sophisticated usage patterns in your applications.

Examples
--------

The package can be imported and used in both Node.js and browser environments using the following syntax:

```html
<script src="./path/to/modulator.amd.js"></script>
<script>
  const debouncedFunc = Modulator.modulate(originalFunc, 1000);
</script>
```

In the example Below, `debouncedFunc` is a debounced version of `originalFunc`. The function `originalFunc` will be invoked no more than once every 1000 milliseconds (1 second).

```js
import Modulator from "./path/to/danielhaim/modulator";

// Debounce the function to be called only once per 100ms
const debouncedFunction = Modulator.modulate(myFunction, 100);

// Call the debounced function on high-frequency events
element.addEventListener('mousemove', debouncedFunction);

const originalFunc = () => {
  console.log('Original function called');
};

const debouncedFunc = Modulator.modulate(originalFunc, 1000);

// Call the debounced function multiple times
debouncedFunc();
debouncedFunc();
debouncedFunc();
debouncedFunc();
debouncedFunc();
```

### Debouncing a resize event listener ###

```js
function handleResize(event) {
  // Do something on resize
}

const debouncedHandleResize = Modulator.modulate(handleResize, 100);

window.addEventListener('resize', debouncedHandleResize);
```

### Debouncing a form submission ###

```js
function handleSubmit(event) {
  event.preventDefault();
  // Make API request to submit form data
}

const debouncedHandleSubmit = Modulator.modulate(handleSubmit, 1000, true);

document.querySelector('#my-form').addEventListener('submit', debouncedHandleSubmit);
```

### Debouncing a search function ###
  
```js
function handleSearch(query) {
  // Make API request and display results
}

const debouncedHandleSearch = Modulator.modulate(handleSearch, 500);

document.querySelector('#search-input').addEventListener('input', (event) => {
  debouncedHandleSearch(event.target.value);
});
```

### Debouncing a mouseover event listener ###

```js
function handleMouseover(event) {
  // Display tooltip or other information
}

const debouncedHandleMouseover = Modulator.modulate(handleMouseover, 250);

document.querySelector('#my-element').addEventListener('mouseover', debouncedHandleMouseover);
```

### Debouncing a resize event listener with a maximum wait time ###

```js
function handleResize(event) {
  // do something on resize
}

const debouncedHandleResize = Modulator.modulate(handleResize, 100, false, null, 10, 500);

window.addEventListener('resize', debouncedHandleResize);
```

### Debouncing a form submission ###

```js
function handleSubmit(event) {
  event.preventDefault();
  // make API request to submit form data
}

const debouncedHandleSubmit = Modulator.modulate(handleSubmit, 1000, true);

document.querySelector('#my-form').addEventListener('submit', debouncedHandleSubmit);
```

### Debouncing a search function ###

```js
function handleSearch(query) {
  // make API request and display results
}

const debouncedHandleSearch = Modulator.modulate(handleSearch, 500);

document.querySelector('#search-input').addEventListener('input', (event) => {
  debouncedHandleSearch(event.target.value);
});
```

### Debouncing a mouseover event listener ###

```js
function handleMouseover(event) {
  // display tooltip or other information
}

const debouncedHandleMouseover = Modulator.modulate(handleMouseover, 250);

document.querySelector('#my-element').addEventListener('mouseover', debouncedHandleMouseover);
```

Advanced Examples
-----------------

### Debouncing a function with cache ###

```js
// Example function to fetch data
function fetchData(query) {
  console.log(`Fetching data for query: ${query}`);
  // Perform an operation, such as fetching from a server
  return Promise.resolve(`Data for "${query}"`);
}

// Debounced version of fetchData with cache size of 2
const debouncedFetchData = Modulator.modulate(fetchData, 500, false, null, 2);

// Call debouncedFetchData multiple times with the same query
debouncedFetchData('apple');
debouncedFetchData('apple');
debouncedFetchData('banana');

// Only the last call will invoke the original function after 500ms
setTimeout(() => {
  debouncedFetchData('apple').then(console.log);
  debouncedFetchData('banana').then(console.log);
}, 1000);
```

### Debouncing a Function with Result Aggregation ###

In this example, `originalFunc` calculates the sum of two numbers. We debounce this function using `modulate`. Despite multiple calls to the debounced function with the same arguments within a short interval, it only executes once after the 1000ms wait time. The result method then retrieves the `result` of the debounced function's last execution, which is `[3]` in this case.

```js
// Define a simple function that adds two numbers
const originalFunc = (x, y) => x + y;

// Create a debounced version of the original function with a 1000ms wait time
const debouncedFunc = Modulator.modulate(originalFunc, 1000);

// Call the debounced function multiple times within a short interval
const results = [];
for (let i = 0; i < 3; i++) {
  results.push(debouncedFunc(1, 2)); // Each call returns a promise
}

// After the debounce interval, check the results
setTimeout(() => {
  // Use Promise.all to wait for all debounced function calls to resolve
  Promise.all(results).then(values => {
    console.log('Results of each debounced call:', values); // Expect multiple [3]
    console.log('Result from the debounced function\'s last execution:', debouncedFunc.result()); // Expect [3]
  });
}, 2000);
```

### Debouncing a function with cache ###

Here's an example of creating a debounced version of a function `fetchData` with a cache size of 2. The debounced function `debouncedFetchData` is called multiple times with the same query ('apple' and 'banana'). Still, the original part is only invoked for the last two calls (one for 'apple' and one for 'banana'). After 1 second, the function is called again for 'apple' and 'banana,' and the results are retrieved from the cache instead of invoking the original function.

```js
import Modulator from "@danielhaim/modulator";

// Example function to fetch data
function fetchData(query) {
  console.log(`Fetching data for query: ${query}`);
  // Perform expensive operation, such as fetching from a server
  return Promise.resolve(`Data for "${query}"`);
}

// Debounced version of fetchData with cache size of 2
const debouncedFetchData = Modulator.modulate(fetchData, 500, false, null, 2);

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

#### maxCacheSize Parameter ###

The modulate function includes a `maxCacheSize` parameter that allows you to control the cache size of the debounced function. This parameter specifies the maximum number of function results that should be cached. Once the cache size is reached, the oldest result will be removed to accommodate the new result. If `maxCacheSize` is set to `null` or `undefined,` the cache will have unlimited size.

#### Caching results ###

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

Tests
-----

```bash
Test Errors
✓ Should throw an error if the first parameter is not a function (2 ms)
✓ Should throw an error if the second parameter is not a number (1 ms)
✓ Should throw an error if the third parameter is not a boolean
✓ Should throw an error if the fifth parameter is not a number (1 ms)
✓ Should throw an error if the sixth parameter is not a number or null (1 ms)
✓ Should throw an error if the sixth parameter is less than the second parameter

Test Parameters
✓ Should debounce the original function (1 ms)
✓ Should delay execution by maxWait time (1 ms)
✓ Should cache results for the same arguments (1 ms)
✓ Should debounce a function and return a debounced function
✓ Should debounce and cache the results of the original function

Test EventListeners
✓ Should trigger mouseover event (1 ms)
✓ Should trigger window resize event
```

Resources
---------

- [The Debouncing and Throttling Explained article on the CSS-Tricks website](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [The Underscore.js documentation on the debounce function](https://underscorejs.org/#debounce)
- [The Lodash documentation on the debounce function](https://lodash.com/docs/4.17.15#debounce)

Report Bugs
-----------

If you encounter any bugs while using Modulator, please report them to the GitHub issue tracker.
When submitting a bug report, please include as much information as possible.
