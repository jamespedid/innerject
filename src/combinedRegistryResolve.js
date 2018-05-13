export function combinedRegistryResolve(registries) {
    return function (key) {
        const registry = registries.find(r => r.has(key));
        if (!registry) {
            throw new RangeError(`could not resolve object: key ${key} not in registries`);
        }
        return registry.resolve(key);
    }
}