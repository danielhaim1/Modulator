import { modulate } from './eventModulator';

const cache = new Map();
function memoize(func) {
    // 1. Return a new function that takes any number of arguments
    return function (...args) {
        // 2. Convert the arguments to a string to be used as a cache key
        const key = JSON.stringify(args);
        // 3. Check if the result for the given arguments has already been cached
        if (cache.has(key)) {
            // 4. If so, return the cached result
            return cache.get(key);
        }
        // 5. Otherwise, call the original function with the given arguments
        const result = func(...args);
        // 6. Cache the result and return it
        cache.set(key, result);
        return result;
    };
}

describe('testing modulate', () => {
    test('should delay execution by maxWait time', async () => {
        jest.useFakeTimers(); // Create a mock function
        const originalFunc = jest.fn(); // Create a modulated version of the function
        const modulatedFunc = modulate(originalFunc, 1000, false, null, 100, 2000); // Call modulated function
        modulatedFunc(); // Schedule the execution of the function
        setTimeout(() => {
            expect(originalFunc)
                .not.toHaveBeenCalled();
        }, 1500);
        setTimeout(async () => {
            await Promise.resolve();
            expect(originalFunc)
                .toHaveBeenCalledTimes(1);
        }, 2500);
    });
    test("should cache results for the same arguments", () => {
        // 1. Define a test function that returns a different result each time
        const originalFunc = jest.fn(x => x + 1);
        // 2. Memoize the test function
        const memoizedFunc = memoize(originalFunc);
        const arg = 1;
        // 3. Call the memoized test function once
        const result1 = memoizedFunc(arg);
        // 4. Call the memoized test function again with the same argument
        const result2 = memoizedFunc(arg);
        // 5. Call the memoized test function again with the same argument
        const result3 = memoizedFunc(arg);
        // 6. Check that the original test function was called only once
        expect(originalFunc)
            .toHaveBeenCalledTimes(1);
        // 7. Check that all the results are the same
        expect(result1)
            .toBe(result2);
        expect(result2)
            .toBe(result3);
    });
    test("should throw an error if the first parameter is not a function", () => {
        expect(() => modulate(null, 500))
            .toThrowError(TypeError);
    });
    test("should throw an error if the second parameter is not a number", () => {
        expect(() => modulate(() => { }, "500"))
            .toThrowError(TypeError);
        expect(() => modulate(() => { }, NaN))
            .toThrowError(TypeError);
    });
    test("should throw an error if the third parameter is not a boolean", () => {
        expect(() => modulate(() => { }, 500, "false"))
            .toThrowError(TypeError);
    });
    test("should throw an error if the fifth parameter is not a number", () => {
        expect(() => modulate(() => { }, 500, true, null, "1000"))
            .toThrowError(TypeError);
        expect(() => modulate(() => { }, 500, true, null, NaN))
            .toThrowError(TypeError);
    });
    test("should throw an error if the sixth parameter is not a number or null", () => {
        expect(() => modulate(() => { }, 500, true, null, 1000, "2000"))
            .toThrowError(TypeError);
        expect(() => modulate(() => { }, 500, true, null, 1000, NaN))
            .toThrowError(TypeError);
    });
    test("should throw an error if the sixth parameter is less than the second parameter", () => {
        expect(() => modulate(() => { }, 500, true, null, 1000, 400))
            .toThrowError(TypeError);
    });
    it("should return a debounced function", () => {
      const originalFunc = (x, y) => x + y;
      const debouncedFunc = modulate(originalFunc, 1000);
      expect(debouncedFunc).toBeDefined();
      expect(typeof debouncedFunc).toBe("function");
    });
    it("should return the expected results", () => {
      const originalFunc = (x, y) => x + y;
      const debouncedFunc = modulate(originalFunc, 1000);
      const promise1 = debouncedFunc(1, 2);
      const promise2 = debouncedFunc(1, 2);
      const promise3 = debouncedFunc(1, 2);
      setTimeout(() => {
        Promise.all([promise1, promise2, promise3]).then((results) => {
          expect(results).toEqual([3, 3, 3]);
          expect(debouncedFunc.result()).toEqual([3]);
        });
      }, 2000);
    });
    test('should debounce the original function', () => {
      const originalFunc = jest.fn();
      const debouncedFunc = modulate(originalFunc, 1000);
  
      debouncedFunc();
      debouncedFunc();
      debouncedFunc();
  
      expect(originalFunc).not.toHaveBeenCalled();
  
      setTimeout(() => {
        expect(originalFunc).toHaveBeenCalledTimes(1);
      }, 2000);
    });
});