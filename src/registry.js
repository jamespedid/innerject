class Registry {
    constructor() {
        this._components = new Map();
        this._factoryInstances = new Map();
        this.resolve = this._resolve.bind(this);
    }

    has(key) {
        return this._components.has(key);
    }

    unregister(key) {
        this._components.delete(key);
    }

    reset() {
        this._components = new Map();
        this._factoryInstances = new Map();
    }

    registerClass(key, Class) {
        this.register('class', key, Class);
    }

    registerInstance(key, instance) {
        this.register('instance', key, instance);
    }

    registerFactory(key, factory) {
        this.register('factory', key, factory);
    }

    registerInstanceFactory(key, factory) {
        this.register('instanceFactory', key, factory);
    }

    register(type, key, object) {
        if (this._components.has(key)) {
            throw new RangeError(`Thee ${key} key is already registered`);
        }
        this._components.set(key, {
            type,
            key,
            object
        });
    }

    _getRegistryItem(key) {
        return this._components.get(key);
    }

    _getFactoryInstance(key) {
        return this._factoryInstances.get(key);
    }

    _resolve(key, ...args) {
        const component = this._getRegistryItem(key);
        if (!component) {
            return new RangeError(`Cannot resolve ${key} dependency`);
        }
        const { type, object } = component;
        let value;
        switch(type) {
            case 'class':
                return new object(...args);
            case 'instance':
                return object;
            case 'factory':
                return object(...args);
            case 'instanceFactory':
                value = this._getFactoryInstance(key);
                if (typeof value !== 'undefined') {
                    return value;
                }
                value = object(...args);
                this._factoryInstances.set(key, value);
                return value;
        }
        throw new RangeError(`could not resolve object: type ${type} is invalid`);
    }
}

export const defaultRegistry = new Registry();
Registry.defaultRegistry = defaultRegistry;
export default Registry;
