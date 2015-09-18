

import {ClassActivator, FactoryActivator, Resolver} from './metadata'
import {Metadata} from './meta/metadata';
import {DIAggregateError, createError, DIError} from './errors'

const paramRegEx = /function[^(]*\(([^)]*)\)/i

export function getFunctionParameters(fn: Function, cache: boolean = true): string[] {
  let params = <string[]>Metadata.getOwn(Metadata.paramTypes, fn)
  if (!params) {
    let match = fn.toString().match(paramRegEx)
    if (match) {
      params = match[1].replace(/\W+/, ' ').split(' ').map(x => x.replace(',', '').trim())
        .filter( m => m !== '')
      if (cache)
        Metadata.define(Metadata.paramTypes, params, fn, undefined);
    }
  }

  return params || [];
}


export class DIBadKeyError extends DIError {
  name = 'BadKeyError'
  message = "key not registered with container"
  constructor(message?: string) {
    super(message);
  }
}

export interface IActivator {
	invoke(fn : Function, args?: any[], targetKey?:string) : any
}

export interface IDependencyResolver {
  resolveDependencies(fn: Function, targetKey?:string): any[]
}


export interface IHandlerFunc {
  (c:IActivator): any
}

export interface ConstructionInfo {
  activator: IActivator
  keys?: string[]
  dependencyResolver?: IDependencyResolver
}

export var emptyParameters = Object.freeze([]);


const instanceActivatorKey = "moby:instance-activator";
const registrationKey = "moby:registration";
const dependencyResolverKey = "moby:dependency-resolver";
(<any>Metadata).instanceActivator =  instanceActivatorKey;
(<any>Metadata).registration = registrationKey;
(<any>Metadata).dependencyResolver = dependencyResolverKey;

export class DIContainer implements IActivator {
  static instance: DIContainer

  entries: Map<any, IHandlerFunc[]>
  constructionInfo: Map<Function, ConstructionInfo>
  parent: DIContainer

  get root (): DIContainer {
    return null
  }

  constructor (info?:Map<Function, ConstructionInfo>) {
    this.entries = new Map<any,IHandlerFunc[]>();
    this.constructionInfo = info||new Map<Function, ConstructionInfo>();
  }

  makeGlobal (): DIContainer {
    DIContainer.instance = this;
    return this
  }

  /**
  * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default singleton registration is used.
  *
  * @method autoRegister
  * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
  * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
  */
  autoRegister(fn : any, key? : any, targetKey?:string) : void {
    var registration;

    if (fn === null || fn === undefined){
      throw new DIBadKeyError();
    }
    if(typeof fn === 'function'){

      registration = Metadata.get(registrationKey, fn, targetKey);

      if(registration !== undefined){
        registration.register(this, key || fn, fn);
      }else{
        this.registerSingleton(key || fn, fn, targetKey);
      }
    }else{
      this.registerInstance(fn, fn);
    }
  }

  /**
  * Unregisters based on key.
  *
  * @method unregister
  * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
  */
  unregister(key : any) : void {
    this.entries.delete(key);
  }

  /**
  * Inspects the container to determine if a particular key has been registred.
  *
  * @method hasHandler
  * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
  * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
  * @return {Boolean} Returns true if the key has been registred; false otherwise.
  */
  hasHandler(key: any, checkParent: boolean = false) : boolean {
    if (key === null || key === undefined){
      throw new DIBadKeyError();
    }

    return this.entries.has(key)
      || (checkParent && this.parent && this.parent.hasHandler(key, checkParent));
  }


  /**
  * Resolves a single instance based on the provided key.
  *
  * @method get
  * @param {Object} key The key that identifies the object to resolve.
  * @return {Object} Returns the resolved instance.
  */
  get(key : any) : any {
    var entry;

    if (key === null || key === undefined){
      throw new DIBadKeyError();
    }

    if(key === DIContainer){
      return this;
    }

    if(key instanceof Resolver){
      return key.get(this);
    }

    entry = this.entries.get(key);

    if (entry !== undefined) {
      return entry[0](this);
    }


    if(this.parent && this.parent.hasHandler(key)){

      return this.parent.get(key)

    }

    // No point in registrering a string
    if (typeof key === 'string') {
      throw createError('DIResolveError','no component registered for key: ' + key)
    }

    this.autoRegister(key);
    entry = this.entries.get(key);

    return entry[0](this);
  }

  /**
  * Resolves all instance registered under the provided key.
  *
  * @method getAll
  * @param {Object} key The key that identifies the objects to resolve.
  * @return {Object[]} Returns an array of the resolved instances.
  */
  getAll(key : any) : any[] {
    var entry;

    if (key === null || key === undefined){
      throw new DIBadKeyError();
    }

    entry = this.entries.get(key);

    if(entry !== undefined){
      return entry.map(x => x(this));
    }

    if(this.parent){
      return this.parent.getAll(key);
    }

    return [];
  }

  /**
  * Creates a new dependency injection container whose parent is the current container.
  *
  * @method createChild
  * @return {Container} Returns a new container instance parented to this.
  */
  createChild() : DIContainer {
    var childContainer = new DIContainer(this.constructionInfo);
    childContainer.parent = this;
    //childContainer.root = this.root;
    return childContainer;
  }

  resolveDependencies (fn:Function, targetKey?:string): any[] {
    var info = this._getOrCreateConstructionSet(fn, targetKey)
    var keys = info.keys,
        args = new Array(keys.length);
    var i, ii;

   try {
    for(i = 0, ii = keys.length; i < ii; ++i){
      args[i] = this.get(keys[i]);
    }
   } catch (e) {
     var message = "Error"
     if (i < ii) {
        message += ` The argument at index ${i} (key:${keys[i]}) could not be satisfied.`;
      }
     throw createError("DependencyError", message);
   }

   return args
  }

  /**
  * Invokes a function, recursively resolving its dependencies.
  *
  * @method invoke
  * @param {Function} fn The function to invoke with the auto-resolved dependencies.
  * @param {any[]} [deps] Additional function dependencies to use during invocation.
  * @return {Object} Returns the instance resulting from calling the function.
  */
  invoke(fn : Function, deps? : any[], targetKey?:string) : any {
    var info = this._getOrCreateConstructionSet(fn, targetKey)

    try{
      var keys, args;
      if (info.dependencyResolver) {
        args = info.dependencyResolver.resolveDependencies(fn);
      } else {
        args = this.resolveDependencies(fn, targetKey)
      }


      if(deps !== undefined && Array.isArray(deps)){
        args = args.concat(deps);
      }

      return (<any>info.activator).invoke(fn, args, targetKey, keys);

    }catch(e){
      var activatingText = info.activator instanceof ClassActivator ? 'instantiating' : 'invoking';
      var message = `Error ${activatingText} ${(<any>fn).name}.`

      message += ' Check the inner error for details.'

      throw createError("DIInvokeError", message, [e]);

    }
  }

  registerInstance(key:any, instance:any) {
    this.registerHandler(key, x => instance);
  }

  registerTransient(key:any, fn:Function, targetKey?:string) {
    this.registerHandler(key, x => x.invoke(fn, null, targetKey) )
  }

  registerSingleton(key:any, fn:Function, targetKey?:string) {
    var singleton;
    this.registerHandler(key, x => singleton|| (singleton = x.invoke(fn,null,targetKey) ))
  }

  registerHandler(key:any, handler: IHandlerFunc) {
    this._getOrCreateEntry(key).push(handler)
  }


  _getOrCreateEntry (key:string): IHandlerFunc[]  {
    var entry;

    if (key === null || key === undefined){
      throw new DIError('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
    }

    entry = this.entries.get(key);

    if (entry === undefined) {
      entry = [];
      this.entries.set(key, entry);
    }

    return entry;

  }

  _getOrCreateConstructionSet(fn:Function, targetKey:string): ConstructionInfo {
    var info = this.constructionInfo.get(fn)

    if (info === undefined) {
      info = this._createConstructionSet(fn, targetKey)
      this.constructionInfo.set(fn,info);
    }
    return info;
  }

  _createConstructionSet(fn:Function, targetKey:string): ConstructionInfo {
    let info: ConstructionInfo = {
      activator:<IActivator>Metadata.getOwn((<any>Metadata).instanceActivator, fn, targetKey)||ClassActivator.instance,
      dependencyResolver: <IDependencyResolver>Metadata.getOwn(dependencyResolverKey,fn,targetKey)||this};




    if ((<any>fn).inject !== undefined) {
      if (typeof (<any>fn).inject === 'function') {
        info.keys = (<any>fn).inject();
      } else {
        info.keys = (<any>fn).inject;
      }

      return info
    }
    info.keys = <string[]>Metadata.getOwn(Metadata.paramTypes, fn, targetKey)
      || getFunctionParameters(fn) || emptyParameters;
    return info;
  }

}
