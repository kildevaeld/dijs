import {DecoratorApplicator} from './decorator-applicator';

export interface DecoratorsConfigType {
  parameterizedDecorator(name : string, decorator : Function) : void
  simpleDecorator(name : string, decorator : Function) : void 
}

export interface DecoratorsType {
	configure : DecoratorsConfigType;
}

export let Decorators : DecoratorsType = {
  configure: {
    parameterizedDecorator(name : string, decorator : Function) : void {
      Decorators[name] = function(){
        var applicator = new DecoratorApplicator();
        return applicator[name].apply(applicator, arguments);
      };

      DecoratorApplicator.prototype[name] = function(){
        var result = decorator.apply(null, arguments);
        return this.decorator(result);
      };
    },
    simpleDecorator(name : string, decorator : Function) : void {
      Decorators[name] = function(){
        return new DecoratorApplicator().decorator(decorator);
      };

      DecoratorApplicator.prototype[name] = function(){
        return this.decorator(decorator);
      }
    }
  }
}
