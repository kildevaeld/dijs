# dijs
Javasript Dependency injector


```typescript
class Logger {
  log (...msg) {
    console.log(msg)
  }
}

@inject(Logger) // optional in typescript
class Test {
  constructor(logger:Logger) {
    logger.log('Hello, World!');
  }
}

var di = new DIContainer();

// Optional in typescript
di.registerSingleton(Logger);

// Instantiate Test class
var test = di.get(Test); // Hello, World!


```
