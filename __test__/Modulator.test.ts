/**
 * @jest-environment jsdom
 */

// Adjust import based on your entry point strategy
// If index.js still exports modulate from src:
import { modulate } from '../src/index'; // Use non-extension import resolved by TS/Webpack
// If using index.ts directly as main entry point eventually:
// import { modulate } from '../src/index';

// Mock timers
jest.useFakeTimers();

// Define the function type for mocks if needed, e.g.:
type MockFunc = jest.Mock<any, any>;

describe('Modulator Basic Debounce', () => {
  test('Should debounce function calls', () => {
    const func: MockFunc = jest.fn(); // Add type annotation
    const debouncedFunc = modulate(func, 100);
    // ... rest of test ...
    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test('Should call immediately if immediate is true', () => {
    const func: MockFunc = jest.fn();
    const debouncedFunc = modulate(func, 100, true);

    debouncedFunc(); // Call 1: Immediate invoke. func calls = 1. Starts cooldown timer.
    expect(func).toHaveBeenCalledTimes(1);

    debouncedFunc(); // Call 2: During cooldown. Sets pending state. Clears cooldown, sets trailing timer. func calls = 1.

    jest.advanceTimersByTime(100); // Trailing timer fires. invokeFunc() for Call 2 args. func calls = 2. timerId = null.
    expect(func).toHaveBeenCalledTimes(2); // Expect trailing call execution

    debouncedFunc(); // Call 3: After everything. timerId is null. Immediate invoke. func calls = 3.
    expect(func).toHaveBeenCalledTimes(3); // <<< CORRECTED EXPECTATION

    jest.advanceTimersByTime(100); // Cooldown timer for Call 3 expires. No invoke.
    expect(func).toHaveBeenCalledTimes(3); // <<< CORRECTED EXPECTATION
  });

  test('Should pass arguments and context correctly', () => {
    const func: MockFunc = jest.fn();
    const context = { key: 'value' };
    // Context type is inferred by modulate, no need to cast typically
    const debouncedFunc = modulate(func, 100, false, context);

    debouncedFunc(1, 'a');
    jest.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith(1, 'a');
    // func.mock.contexts[0] refers to the 'this' context
    expect(func.mock.contexts[0]).toBe(context);
  });

   test('Should return a promise resolving with the function result', async () => {
      // Infer function type
      const func = jest.fn((x: number) => x * 2);
      const debouncedFunc = modulate(func, 100);

      const promise = debouncedFunc(5);
      jest.advanceTimersByTime(100);

      await expect(promise).resolves.toBe(10);
      expect(func).toHaveBeenCalledWith(5);
  });

    test('Should handle promises correctly for immediate calls and subsequent calls', async () => {
        const func = jest.fn((x: number) => x * 2);
        const debouncedFunc = modulate(func, 100, true);

        // Call 1: Immediate execution
        const promise1 = debouncedFunc(5);
        await expect(promise1).resolves.toBe(10);
        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenLastCalledWith(5);

        // Call 2: During cooldown - sets pending state, schedules trailing call
        const promise2 = debouncedFunc(6);
        expect(func).toHaveBeenCalledTimes(1); // Not called yet

        // Advance time past cooldown period / wait time
        jest.advanceTimersByTime(100);
        // Trailing edge timer (set by Call 2) should fire now, invoking func(6)
        // and resolving promise2.
        await expect(promise2).resolves.toBe(12); // <<< CORRECTED: Expect RESOLVE
        expect(func).toHaveBeenCalledTimes(2); // Should be called for 6 now
        expect(func).toHaveBeenLastCalledWith(6);

        // Call 3: After cooldown/trailing call - Immediate execution
        const promise3 = debouncedFunc(7);
        await expect(promise3).resolves.toBe(14); // Resolves immediately
        expect(func).toHaveBeenCalledTimes(3); // Called for 7 now
        expect(func).toHaveBeenLastCalledWith(7);

        // Advance time again to ensure no unexpected trailing calls from cooldown
        jest.advanceTimersByTime(100);
        expect(func).toHaveBeenCalledTimes(3);
    });


});
// ... rest of the tests remain largely the same, add types to jest.fn() if desired ...

// Example for error test:
describe('Modulator Error Handling & Cancel', () => {
  test('Should reject promise if original function throws synchronously', async () => {
    const error = new Error('Sync Error');
    // Explicitly type the mock function signature if needed
    const func = jest.fn<()=>never, []>(() => { throw error; });
    const debouncedFunc = modulate(func, 100);

    const promise = debouncedFunc();
    jest.advanceTimersByTime(100);

    await expect(promise).rejects.toThrow(error);
  });

  // ... other tests ...
   test('debounced.cancel() should prevent execution and reject pending promise', async () => {
    const func: MockFunc = jest.fn();
    const debouncedFunc = modulate(func, 100);

    const promise = debouncedFunc();

    // Cancel before timer expires
    debouncedFunc.cancel();

    jest.advanceTimersByTime(100);

    // Function should not have been called
    expect(func).not.toHaveBeenCalled();
    // Pending promise should be rejected
    await expect(promise).rejects.toThrow('Debounced function call was cancelled.');

  });
});

// ... Parameter validation tests ...
describe('Modulator Parameter Validation', () => {
    test("Should throw an error if the first parameter is not a function", () => {
		// Need to cast null to any to satisfy TS before runtime check
		expect(() => modulate(null as any, 500)).toThrow(TypeError);
	});
	test("Should throw an error if the second parameter is not a non-negative number", () => {
        // Cast to any for invalid types
		expect(() => modulate(() => {}, "500" as any)).toThrow(TypeError);
		expect(() => modulate(() => {}, NaN)).toThrow(TypeError);
        expect(() => modulate(() => {}, -100)).toThrow(TypeError);
	});
    // ... other validation tests similarly using 'as any' for invalid types if needed ...
    test("Should throw an error if the third parameter is not a boolean", () => {
		expect(() => modulate(() => {}, 500, "false" as any)).toThrow(TypeError);
	});
     test("Should throw an error if maxWait is less than wait", () => {
		expect(() => modulate(() => {}, 500, false, null, 100, 400)).toThrow(TypeError);
	});
}); 