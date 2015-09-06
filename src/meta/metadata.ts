
const theGlobal = (function() {
  // Workers don’t have `window`, only `self`
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  // Not all environments allow eval and Function
  // Use only as a last resort:
  return new Function('return this')();
})();

const emptyMetadata = Object.freeze({});
const metadataContainerKey = '__metadata__';

if(typeof theGlobal.System === 'undefined'){
  theGlobal.System = { isFake:true };
}

if(typeof theGlobal.System.forEachModule === 'undefined'){
  theGlobal.System.forEachModule = function(){};
}

if(typeof theGlobal.Reflect === 'undefined'){
  theGlobal.Reflect = {};
}

if(typeof theGlobal.Reflect.getOwnMetadata === 'undefined'){
  (<any>Reflect).getOwnMetadata = function(metadataKey, target, targetKey){

    return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
  };
}

if(typeof theGlobal.Reflect.defineMetadata === 'undefined'){
  (<any>Reflect).defineMetadata = function(metadataKey, metadataValue, target, targetKey){

    var metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : (target[metadataContainerKey] = {});

    var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
    targetContainer[metadataKey] = metadataValue;
  };
}

if(typeof theGlobal.Reflect.metadata === 'undefined'){
  (<any>Reflect).metadata = function(metadataKey, metadataValue){
    return function(target, targetKey){
      (<any>Reflect).defineMetadata(metadataKey, metadataValue, target, targetKey);
    };
  };
}

if (typeof theGlobal.Reflect.construct) {
  (<any>Reflect).construct = function(fn:any, args){
    return new fn(...args)
  };
}

function ensureDecorators(target){
  var applicator;

  if(typeof target.decorators === 'function'){
    applicator = target.decorators();
  }else{
    applicator = target.decorators;
  }

  if(typeof applicator._decorate === 'function'){
    delete target.decorators;
    applicator._decorate(target);
  }else{
    throw new Error('The return value of your decorator\'s method was not valid.');
  }
}

export interface MetadataType {
  global: Object;
  noop: Function;
  resource:string;
  paramTypes:string;
  properties:string;
}

/**
* Provides helpers for working with metadata.
*
* @class Metadata
* @static
*/
export var Metadata  = {
  global: theGlobal,
  noop: function(){},
  resource:'aurelia:resource',
  paramTypes:'design:paramtypes',
  properties:'design:properties',

  get(metadataKey : string, target : Function, targetKey?: string) : Object {

    if(!target){
      return undefined;
    }

    let result = Metadata.getOwn(metadataKey, target, targetKey);
    return result === undefined ? Metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
  },

  getOwn(metadataKey : string, target : Function, targetKey?: string) : Object {

    if(!target){
      return undefined;
    }

    if(target.hasOwnProperty('decorators')){
      ensureDecorators(target);
    }

    return (<any>Reflect).getOwnMetadata(metadataKey, target, targetKey);
  },

  define(metadataKey : string, metadataValue : Object, target : Function, targetKey : string) : void {

    (<any>Reflect).defineMetadata(metadataKey, metadataValue, target, targetKey);
  },

  getOrCreateOwn(metadataKey : string, Type : FunctionConstructor, target : Function, targetKey : string) : Object {
    let result = Metadata.getOwn(metadataKey, target, targetKey);

    if(result === undefined){
      result = new Type();
      (<any>Reflect).defineMetadata(metadataKey, result, target, targetKey);
    }

    return result;
  }
}
