import { defaultRegistry } from './registry';

export function innerject(mapArgs, resolve = defaultRegistry.resolve) {
    return function innerjectContainer(Class) {
        return class InnerjectedClass extends Class {
            static WrappedClass = Class;
            constructor(...args) {
                const mappedArgs = mapArgs(resolve, args);
                super(...mappedArgs);
            }
        }
    }
}