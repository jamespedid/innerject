import { expect } from 'chai';

import { Registry, innerject, innerjectFunc } from '../src';

describe('innerject', function () {
    const registry = new Registry();

    class DependencyA {
        get value() {
            return 'DependencyA';
        }
    }

    class DependencyB {
        get value() {
            return 'DependencyB';
        }
    }

    class DependencyC {
        constructor({ dependencyA, dependencyB }) {
            this.dependencyA = dependencyA;
            this.dependencyB = dependencyB;
        }

        get value() {
            return `${this.dependencyA.value} ${this.dependencyB.value}`;
        }
    }

    const InnerjectedDependencyC = innerject(resolve => {
        const dependencyA = resolve('dependencyA');
        const dependencyB = resolve('dependencyB');
        return [{ dependencyA, dependencyB }];
    }, registry.resolve)(DependencyC);

    function target({
        dependencyA,
        dependencyC,
    }, ...args) {
        return `${dependencyA.value} ${dependencyC.value} ${args.join(' ')}`;
    }

    function target2({
        dependencyA,
        dependencyB,
    }) {
        return [dependencyA, dependencyB, this];
    }

    const innerjectedFunc = innerjectFunc((resolve, args) => {
        const dependencyA = resolve('dependencyA');
        const dependencyC = resolve('dependencyC');
        return [{ dependencyA, dependencyC }, ...args];
    }, registry.resolve)(target);

    const innerjectedFunc2 = innerjectFunc((resolve, args) => {
        const dependencyA = resolve('dependencyA');
        const dependencyB = resolve('dependencyB');
        return [{ dependencyA, dependencyB }, ...args];
    }, registry.resolve)(target2);

    registry.registerClass('dependencyA', DependencyA);
    registry.registerInstance('dependencyB', new DependencyB());
    registry.registerFactory('dependencyC', () => new InnerjectedDependencyC());

    it('should resolve dependencyC with dependencyA and dependencyB', function () {
        const dependencyC = new InnerjectedDependencyC();
        expect(dependencyC.value).to.equal('DependencyA DependencyB');
    });

    it('should create innerjectedFunc with dependencyA and dependencyC resolved', function () {
        const result = innerjectedFunc('argument1', 'argument2');
        expect(result).to.equal('DependencyA DependencyA DependencyB argument1 argument2');
    });

    it('should have the wrapped function available', function () {
        expect(innerjectedFunc.wrappedFunction).to.equal(target);
    });

    it('innerjected function this should be undefined', function () {
        const [, , thisObj] = innerjectedFunc2();
        expect(thisObj).to.equal(undefined);
    });

    it('should have a clear class name', function () {
        expect(InnerjectedDependencyC.name).to.equal('Innerject(DependencyC)')
    });

});