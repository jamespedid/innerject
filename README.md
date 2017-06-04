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
