import { expect } from 'chai';

import { Registry, innerject } from '../src';

describe('innerject', function () {
    const registry = new Registry();

    class DependencyA {
        get value() {
            return 'DependencyA';
        }
    }

    class DependencyB {
        get value() {
            return 'DependencyB'
        }
    }

    class DependencyC {
        constructor({ dependencyA, dependencyB }) {
            this.dependencyA = dependencyA;
            this.dependencyB = dependencyB;
        }

        get value() {
            return `${this.dependencyA.value} ${this.dependencyB.value}`
        }
    }

    const InnerjectedDependencyC = innerject(resolve => {
        const dependencyA = resolve('dependencyA');
        const dependencyB = resolve('dependencyB');
        return [{ dependencyA, dependencyB }];
    }, registry.resolve)(DependencyC);

    class Target {
        constructor({dependencyA, dependencyC}, ...args) {
            this.dependencyA = dependencyA;
            this.dependencyC = dependencyC;
            this.args = args;
        }

        get value() {
            return `${this.dependencyA.value} ${this.dependencyC.value} ${this.args.join(' ')}`
        }
    }

    const InnerjectedTarget = innerject((resolve, args) => {
        const dependencyA = resolve('dependencyA');
        const dependencyC = resolve('dependencyC');
        return [{ dependencyA, dependencyC }, ...args];
    }, registry.resolve)(Target);

    registry.registerClass('dependencyA', DependencyA);
    registry.registerInstance('dependencyB', new DependencyB());
    registry.registerFactory('dependencyC', () => new InnerjectedDependencyC());

    it('should resolve dependencyC with dependencyA and dependencyB', function () {
        const dependencyC = new InnerjectedDependencyC();
        expect(dependencyC.value).to.equal('DependencyA DependencyB');
    });

    it('should create InnerjectedTarget with dependencyA and dependencyC resolved', function () {
        const innerjectedTarget = new InnerjectedTarget('argument1', 'argument2');
        expect(innerjectedTarget.value).to.equal('DependencyA DependencyA DependencyB argument1 argument2');
    })
});