import {
    modulate
} from './eventModulator';
describe('modulate', () => {
    jest.useFakeTimers();
    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });
    test('should call the original function only once', () => {
        const originalFunc = jest.fn();
        const modulatedFunc = modulate(originalFunc, 500);
        // Call modulated function multiple times
        modulatedFunc();
        modulatedFunc();
        modulatedFunc();
        // Wait for the debounce time to pass
        jest.advanceTimersByTime(600);
        // Original function should be called once
        expect(originalFunc)
            .toHaveBeenCalledTimes(1);
    });
    test('should call the original function with correct arguments', () => {
        const originalFunc = jest.fn();
        const modulatedFunc = modulate(originalFunc, 500);
        const expectedArgs = ['foo', 'bar'];
        // Call modulated function with expected arguments
        modulatedFunc(...expectedArgs);
        // Wait for the debounce time to pass
        jest.advanceTimersByTime(600);
        // Original function should be called once with expected arguments
        expect(originalFunc)
            .toHaveBeenCalledTimes(1);
        expect(originalFunc)
            .toHaveBeenCalledWith(...expectedArgs);
    });
    test('should cancel the function execution', () => {
        const originalFunc = jest.fn();
        const modulatedFunc = modulate(originalFunc, 500);
        // Call modulated function and immediately cancel
        modulatedFunc();
        modulatedFunc.cancel();
        // Wait for the debounce time to pass
        jest.advanceTimersByTime(600);
        // Original function should not be called
        expect(originalFunc)
            .not.toHaveBeenCalled();
    });
    test('should call the original function with the last set of arguments if multiple calls were made within wait time', async () => {
        const originalFunc = jest.fn()
            .mockReturnValue(4);
        const modulatedFunc = modulate(originalFunc, 500);
        // Call modulated function multiple times within wait time
        modulatedFunc(1);
        modulatedFunc(2);
        modulatedFunc(3);
        // Wait for the debounce time to pass
        jest.advanceTimersByTime(600);
        // Original function should be called once with the last set of arguments
        expect(originalFunc)
            .toHaveBeenCalledTimes(1);
        expect(originalFunc)
            .toHaveBeenCalledWith(3);
    });
    test('should be able to execute the original function immediately when immediate is true', () => {
        const originalFunc = jest.fn();
        const modulatedFunc = modulate(originalFunc, 500, true);
        // Call modulated function
        const result = modulatedFunc();
        // Original function should be called immediately
        expect(originalFunc)
            .toHaveBeenCalledTimes(1);
        // Promise should resolve with the result of the original function
        return expect(result)
            .resolves.toBeUndefined();
    });

    // !TODO
    // The test runner has a default timeout value of 5 seconds, but some tests may take longer to complete

    // test('should cache results and avoid unnecessary function calls', async () => {
    //   const originalFunc = jest.fn().mockReturnValue(4);
    //   const modulatedFunc = modulate(originalFunc, 100); // reduce wait time to 100ms

    //   // Call modulated function multiple times with the same arguments
    //   const promise1 = modulatedFunc('arg1', 'arg2');
    //   const promise2 = modulatedFunc('arg1', 'arg2');
    //   const promise3 = modulatedFunc('arg1', 'arg2');

    //   // Wait for the debounce time to pass
    //   jest.advanceTimersByTime(200); // increase wait time to 200ms

    //   // All promises should be resolved with the result of the original function
    //   const results = await Promise.all([promise1, promise2, promise3]);
    //   expect(results).toEqual([4, 4, 4]);

    //   // Original function should only be called once with the given arguments
    //   expect(originalFunc).toHaveBeenCalledTimes(1);
    //   expect(originalFunc).toHaveBeenCalledWith('arg1', 'arg2');
    // }, 5000); // increase timeout to 5 seconds

    test('should throw an error if the first parameter is not a function', () => {
        expect(() => modulate())
            .toThrow(TypeError);
        expect(() => modulate('not a function', 500))
            .toThrow(TypeError);
    });
    test('should throw an error if the second parameter is not a number', () => {
        expect(() => modulate(() => {}, 'not a number'))
            .toThrow(TypeError);
        expect(() => modulate(() => {}, NaN))
            .toThrow(TypeError);
    });
});
