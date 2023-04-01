# Event Modulator

[![npm version](https://img.shields.io/npm/v/@danielhaim/event-modulator)](https://www.npmjs.com/package/@danielhaim/event-modulator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/@danielhaim/event-modulator.svg)](https://www.npmjs.com/package/@danielhaim/event-modulator)

Event Modulator is an advanced debouncing function designed to optimize high-frequency events in web applications such as scroll, resize, input, by delaying the execution of the original function until a certain amount of time has passed since the last call, the function enhances the performance of the application by reducing unnecessary function calls and ensuring that the function is only executed when needed. Additionally, the function includes a cache system that stores the results of the function calls, avoiding unnecessary repeated function executions for the same set of arguments.

## Demo

<a target="_blank" href="https://danielhaim1.github.io/event-modulator/"><img src="dist/demo.png" width="100%" height="auto"></a>

## Installation
You can install this module via npm:

```bash
npm i @danielhaim/event-modulator
```

### Usage (Node.js)
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

This will only log the message "Original function called" once, after the wait time of 1000ms.

### Usage (Browser)

The function can also be used in a browser environment by including the `event.modulator.js` script in your HTML file:

```html
<script src="./path/to/event.modulator.browser.js"></script>
```

After that, the `modulate` function can be accessed in your JavaScript code like this:

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

## Options

The modulate function accepts the following parameters:

- `func`: The function to be debounced.
- `wait`: The number of milliseconds to wait before invoking the function.
- `immediate`: (optional) Whether to invoke the function on the leading edge (true) or trailing edge (false) of the wait interval. Defaults to false.
- `context`: (optional) The execution context to use for the function. Defaults to null.
- `maxCacheSize`: (optional) The maximum size of the cache that stores the results of the function calls. Defaults to 100.

## Methods

The debounced function has two additional properties:

- `debounced.cancel()`: a method that can be called to cancel the debounced function execution.
- `debounced.result()`: a method that returns the result of the last execution of the debounced function.

### Example

In this example, the function `originalFunc` returns the sum of two numbers. The debounced function is called three times with the same arguments, but it will only execute once after the wait time of 1000ms has passed. The `result` method returns the result of the last execution of the debounced function, which is `[3]`.

```javascript
const originalFunc = (x, y) => {
  return x + y;
};

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

## Advanced Usage

This example creates a debounced version of a function `fetchData`, with a cache size of 2. The debounced function `debouncedFetchData` is called multiple times with the same query ('apple' and 'banana'), but the original function is only invoked for the last 2 calls (one for 'apple' and one for 'banana'). After 1 second, the function is called again for 'apple' and 'banana', and the results are retrieved from the cache instead of invoking the original function.

We can also update the options section to include information about the maxCacheSize parameter:


```javascript
const { modulate } = require('./eventModulator');

// Example function to be debounced
function fetchData(query) {
  console.log(`Fetching data for query: ${query}`);
  // Perform some expensive operation, e.g. fetch data from a server
  return Promise.resolve(`Data for query "${query}"`);
}

// Debounced version of fetchData, with a cache size of 2
const debouncedFetchData = modulate(fetchData, 500, false, null, 2);

// Call debouncedFetchData multiple times with the same query
debouncedFetchData('apple');
debouncedFetchData('apple');
debouncedFetchData('apple');
debouncedFetchData('banana');
debouncedFetchData('banana');

// After 1 second, only the last 2 calls will invoke the original function
setTimeout(() => {
  debouncedFetchData('apple');
  debouncedFetchData('banana');
}, 1000);
```

## Tests

```bash
 PASS  src/eventModulator.test.js
  modulate
    ✓ should call the original function only once (2 ms)
    ✓ should call the original function with correct arguments
    ✓ should cancel the function execution (1 ms)
    ✓ should call the original function with the last set of arguments if multiple calls were made within wait time
    ✓ should be able to execute the original function immediately when immediate is true (1 ms)
    ✓ should throw an error if the first parameter is not a function (2 ms)
    ✓ should throw an error if the second parameter is not a number

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        0.143 s, estimated 6 s
```

## Resources

- [The Debouncing and Throttling Explained article on the CSS-Tricks website](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [The Underscore.js documentation on the debounce function](https://underscorejs.org/#debounce)
- [The Lodash documentation on the debounce function](https://lodash.com/docs/4.17.15#debounce)

## Report Bugs

If you encounter any bugs while using Modulator, please report them to the GitHub issue tracker. When submitting a bug report, please include as much information as possible.