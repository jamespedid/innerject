# innerject
Simple dependency injection solution for Javascript.

# What is innerject?

Innerject is a simple dependency injection javascript framework for javascript classes. Inspired by the connect function from react-redux, the innerject library is powered by a two step process: registration of dependencies and then resolving these dependencies at 'new' time for wrapped classes. Here's a sneak peek of how to use innerject

### Your entry point (time of registration)
```javascript
import { defaultRegistry } from 'innerject';
import MyDependency from './mydependency';

// first argument is registration key, which can be anything. 
// Using the class or library itself is recommended.
// second argument is the class, instance, or factory you are registering,
// depending on which register method you choose:
defaultRegistry.registerClass(MyDependency, MyDependency)  
// Below are alternatives depending on your lifecycle expectations of the dependent object:
// or defaultRegistry.registerInstance(MyDependency, new MyDependency)
// or defaultRegistry.registerFactory(MyDependency, () => new MyDependency())
// or defaultRegistry.registerInstanceFactory(MyDependency, () => new MyDependency())
```

### Your dependency definition
```javascript
class MyDependency() {
  speak() {
     return 'Hello from MyDependency';
  }
} 

export default MyDependency;
```

### Your dependency consumer definition
```javascript
import { innerject } from 'innerject'; 
import MyDependency from './mydependency'

export class MyConsumer {
   constructor(speaker, additionalText) {
       this.speaker = speaker;
       this.additionalText = additionalText;
   }
   
   speak() {
      return `Alert: ${this.speaker.speak()} along with ${this.additionalText}`;
   }
}

// this function produces a new class that subclasses the MyConsumer, and simply takes
// the return value of the innerject function as the arguments that is passed into the super call
// of MyConsumer. All other behavior is the same.
const InnerjectedConsumer = innerject((resolve, arguments) => {
    // this function should return the arguments for the constructor of the wrapped class.
    // the resolve function is from the defaultRegistry and will resolve the matching dependency key.
    return [resolve(MyDependency), ...arguments]; 
})(MyConsumer) 

export default InnerjectedConsumer;
```

### Using the dependency consumer
```javascript
// this file is run after the registration time. If it does not, the resolve will return nothing.
import { InnerjectedConsumer } from './myconsumer';

// below, the dependencies are resolved at 'new' time, and a new instance of MyDependency is created here
// because we used the registerClass method.
var consumer = new InnerjectedConsumer('my additional text');
console.log(consumer.speak()); //logs 'Alert: Hello from MyDependency along with my additional text'
```

# API

## Registry

**registerClass(dependencyKey, dependencyClass)**

This function is used to register a class as a dependency. The dependency key is the object that is used to retrieve the dependency through the resolve function. At resolve time, a new dependencyClass instance is created using the new keyword with the arguments passed into the resolve function.

It is recommended to use the class itself as the dependencyKey, to ensure that the appropriate require is included in the file definition, so your code is easier to reason about, but anything can be used, such as a symbol or string.

**registerInstance(dependencyKey, dependencyInstance)**

This function is used to register an actual instance as a dependency. The dependency key is the object that is used to retrieve the dependency through the resolve function. At resolve time, the instance that was registered with this function is returned. The arguments passed into the resolve function are ignored.

It is recommended to a string or symbol as a key here that relates to what the object is heuristically, because typically the items that you would be registering this way are intended to be singleton objects, database connections, or other dependencies that have a well-defined role in your code base.

**registerFactory(dependencyKey, dependencyFactory)**

This function is used to register a function that produces a dependency. The dependency key is the object that is used to retrieve the dependency through the resolve function. At resolve time, the factory is evaluated with the arguments being passed into the resolve function and the return value of the function is resolved.

Much like the registerClass function, it is recommended that you use the actual function itself as a dependency key to make sure the function can be tracked through the files that it is used in.

**registerInstanceFactory(dependencyKey, dependencyFactory)**

This function is used to register a function that produces a dependency. The dependency key is the object that is used to retrieve the dependency through the resolve function. At resolve time, if the factory is being called for the first time, the factory function is resolved using the arguments of the resolve function, and the result is cached. If being resolved after the first time, the cached value is used.

Much like the registerInstance function, it is recommended that you use a string or a symbol that relates to the object heuristically, and the object returned from the factory is intended to behave as a singleton object.

**resolve(dependencyKey, ...args):Any**

This function is used to produce a registered dependency from the dependencyKey. The way the resolve happens is based on the way the dependencyKey is registered. The resolved dependency is returned.

Note: this function is automatically bound to the Registry instance, so there is no need to bind it to the Registry when passing it into the innerject function.

## innerject

**innerject(mapArgs, resolveFn):Function**

The innerject function returns a function that takes one argument, which is strongly intended to be an ES6 Class. This function takes the class and creates a new class that inherits from it; this copy has a modified constructor that will modify the arguments being passed into it using the mapArgs function.

**mapArgs(resolve, args):Array**

This function has two parameters that are available to it: the resolve function that you have provided, and the arguments that are passed into the constructor of the wrapped function. The returned value here is an array of arguments that are passed into the original wrapped class.

# Notes

The innerject functions can be used recursively, meaning that if you register an innerjected class as a class dependency, then that dependency is resolved at the same time as the new object is being created, provided that you resolve that dependency as part of the mapArgs function.

The above recursive structure does not allow for cycles, and offers no safeguards for having them. If you need to have cyclic dependencies, then you have to resolve this yourself manually; this topic is beyond the scope of this library.