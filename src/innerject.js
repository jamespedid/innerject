import { defaultRegistry } from './registry';

export function innerject(mapArgs, resolve = defaultRegistry.resolve) {
    return function innerjectContainer(Class) {
        return class InnerjectedClass extends Class {
            constructor(...args) {
                const mappedArgs = mapArgs(resolve, args);
                super(...mappedArgs);
            }
        }
    }
}