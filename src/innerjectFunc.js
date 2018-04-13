import { defaultRegistry } from './registry';

export function innerjectFunc(mapArgs, resolve = defaultRegistry.resolve) {
    return function innerjectFuncContainer(func) {
        function innerjectedFunc(...args) {
            const mappedArgs = mapArgs(resolve, args);
            return func(...mappedArgs);
        }
        innerjectedFunc.wrappedFunction = func;
        return innerjectedFunc;
    }
}