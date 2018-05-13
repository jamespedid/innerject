import { expect } from 'chai';

import { Registry, combinedRegistryResolve } from '../src';

describe('combinedRegistryResolve', function () {

    const object1 = {name: '1'};
    const object2 = {name: '2'};
    const object3 = {name: '3'};
    const Registry1 = new Registry();
    const Registry2 = new Registry();
    Registry1.registerInstance(object1, object1);
    Registry2.registerInstance(object1, object3);
    Registry2.registerInstance(object2, object2);

    it('should return a function', function () {
        const resolver = combinedRegistryResolve([Registry1, Registry2]);
        expect(resolver).to.be.a('function');
    });

    describe('returned function', function () {

        it('should resolve a key from the first object', function () {
            const resolver1 = combinedRegistryResolve([Registry1, Registry2]);
            const resolver2 = combinedRegistryResolve([Registry2, Registry1]);
            expect(resolver1(object1)).to.equal(object1);
            expect(resolver2(object1)).to.equal(object3);
        });

        it('should resolve a key from the next object if not present in the first', function () {
            const resolver = combinedRegistryResolve([Registry1, Registry2]);
            expect(resolver(object2)).to.equal(object2);
        });

        it('should throw a RangeError if no object contains that key', function () {
            const resolver = combinedRegistryResolve([Registry1, Registry2]).bind(null, object3);
            expect(resolver).to.throw(RangeError);
        });

    });
});