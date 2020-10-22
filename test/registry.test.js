import { expect } from 'chai';

import { Registry } from '../src';

describe('Registry', function () {
    class TestClass {
        value() {
            return 'TestClass'
        }
    }

    function testClassFactory() {
        const instance = new TestClass();
        instance.factoryMade = true;
        return instance;
    }

    describe('registering a class', function () {
        it('should have a function to register an object as a class', function () {
            const registry = new Registry();
            registry.registerClass(TestClass, TestClass);
            expect(registry._getRegistryItem(TestClass)).to.be.an('object');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('type')
                .that.equals('class');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('object')
                .that.equals(TestClass);
        });

        it('should resolve an instance of that class', function () {
            const registry = new Registry();
            registry.registerClass(TestClass, TestClass);
            expect(registry.resolve(TestClass)).to.be.an.instanceOf(TestClass);
        });

        it('should resolve a different object each time', function () {
            const registry = new Registry();
            registry.registerClass(TestClass, TestClass);
            const testClass1 = registry.resolve(TestClass);
            const testClass2 = registry.resolve(TestClass);
            expect(testClass1).to.not.equal(testClass2);
        });
    });

    describe('registering a singleton', function () {
        it('should have a function to register an object as a class', function () {
            const registry = new Registry();
            registry.registerSingleton(TestClass, TestClass);
            expect(registry._getRegistryItem(TestClass)).to.be.an('object');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('type')
                .that.equals('singleton');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('object')
                .that.equals(TestClass);
        });

        it('should resolve an instance of that class', function () {
            const registry = new Registry();
            registry.registerSingleton(TestClass, TestClass);
            expect(registry.resolve(TestClass)).to.be.an.instanceOf(TestClass);
        });

        it('should resolve the same object each time', function () {
            const registry = new Registry();
            registry.registerSingleton(TestClass, TestClass);
            const testClass1 = registry.resolve(TestClass);
            const testClass2 = registry.resolve(TestClass);
            expect(testClass1).to.equal(testClass2);
        });
    });

    describe('registering an instance', function () {
        it('should have a function to register an instance of a class', function () {
            const registry = new Registry();
            const instance = new TestClass();
            registry.registerInstance(TestClass, instance);
            expect(registry._getRegistryItem(TestClass)).to.be.an('object');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('type')
                .that.equals('instance');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('object')
                .that.equals(instance);
        });

        it('should resolve the registered instance', function () {
            const registry = new Registry();
            const instance = new TestClass();
            registry.registerInstance(TestClass, instance);
            expect(registry.resolve(TestClass)).to.equal(instance);
        });

        it('should resolve a different object each time', function () {
            const registry = new Registry();
            const instance = new TestClass();
            registry.registerInstance(TestClass, instance);
            const instance1 = registry.resolve(TestClass);
            const instance2 = registry.resolve(TestClass);
            expect(instance1).to.equal(instance2);
        });
    });

    describe('registering a factory', function () {
        it('should have a function to register an object as a class', function () {
            const registry = new Registry();
            registry.registerFactory(TestClass, testClassFactory);
            expect(registry._getRegistryItem(TestClass)).to.be.an('object');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('type')
                .that.equals('factory');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('object')
                .that.equals(testClassFactory);
        });

        it('should resolve the return value of the factory', function () {
            const registry = new Registry();
            registry.registerFactory(TestClass, testClassFactory);
            expect(registry.resolve(TestClass)).to.have
                .property('factoryMade')
                .that.equals(true);
        });

        it('should resolve a different object each time', function () {
            const registry = new Registry();
            registry.registerFactory(TestClass, testClassFactory);
            const testClass1 = registry.resolve(TestClass);
            const testClass2 = registry.resolve(TestClass);
            expect(testClass1).to.not.equal(testClass2);
        });
    });

    describe('registering an instance factory', function () {
        it('should have a function to register an object as a class', function () {
            const registry = new Registry();
            registry.registerInstanceFactory(TestClass, testClassFactory);
            expect(registry._getRegistryItem(TestClass)).to.be.an('object');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('type')
                .that.equals('instanceFactory');
            expect(registry._getRegistryItem(TestClass)).to.have
                .property('object')
                .that.equals(testClassFactory);
        });

        it('should resolve the return value of the factory', function () {
            const registry = new Registry();
            registry.registerInstanceFactory(TestClass, testClassFactory);
            expect(registry.resolve(TestClass)).to.have
                .property('factoryMade')
                .that.equals(true);
        });

        it('should resolve the same object each time', function () {
            const registry = new Registry();
            registry.registerInstanceFactory(TestClass, testClassFactory);
            const testClass1 = registry.resolve(TestClass);
            const testClass2 = registry.resolve(TestClass);
            expect(testClass1).to.equal(testClass2);
        });
    });

    describe('registry maintenance', function () {
        it('should have a function to check if a key is registered', function () {
            const registry = new Registry();
            registry.registerClass(TestClass, TestClass);
            expect(registry.has(TestClass)).to.equal(true);
            expect(registry.has('anotherkey')).to.equal(false);
        });

        it('should have a function to unregister a key', function () {
            const registry = new Registry();
            registry.registerClass(TestClass, TestClass);
            registry.unregister(TestClass);
            expect(registry.has(TestClass)).to.equal(false);
        });

        it('should have a function to reset the registry', function () {
            const registry = new Registry();
            registry.registerClass(TestClass, TestClass);
            registry.reset();
            expect(registry._components.size).to.equal(0);
            expect(registry._factoryInstances.size).to.equal(0);
        })
    })
});