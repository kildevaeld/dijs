/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

	function test() {}
	if (!test.name) {
	    Object.defineProperty(Function.prototype, 'name', {
	        get: function get() {
	            var name = this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
	            // For better performance only parse once, and then cache the
	            // result through a new accessor for repeated access.
	            Object.defineProperty(this, 'name', { value: name });
	            return name;
	        }
	    });
	}
	var Version = '0.0.2';
	exports.Version = Version;

	var _container = __webpack_require__(1);

	_defaults(exports, _interopExportWildcard(_container, _defaults));

	var _metaIndex = __webpack_require__(5);

	_defaults(exports, _interopExportWildcard(_metaIndex, _defaults));

	var _decorators = __webpack_require__(8);

	_defaults(exports, _interopExportWildcard(_decorators, _defaults));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.getFunctionParameters = getFunctionParameters;

	var _metadata = __webpack_require__(2);

	var _metaMetadata = __webpack_require__(3);

	var _errors = __webpack_require__(4);

	var paramRegEx = /function[^(]*\(([^)]*)\)/i;

	function getFunctionParameters(fn) {
	    var cache = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	    var params = _metaMetadata.Metadata.getOwn(_metaMetadata.Metadata.paramTypes, fn);
	    if (!params) {
	        var match = fn.toString().match(paramRegEx);
	        if (match) {
	            params = match[1].replace(/\W+/, ' ').split(' ').map(function (x) {
	                return x.replace(',', '').trim();
	            }).filter(function (m) {
	                return m !== '';
	            });
	            if (cache) _metaMetadata.Metadata.define(_metaMetadata.Metadata.paramTypes, params, fn, undefined);
	        }
	    }
	    return params || [];
	}

	class DIBadKeyError extends _errors.DIError {
	    constructor(message) {
	        super(message);
	        this.name = 'BadKeyError';
	        this.message = "key not registered with container";
	    }
	}

	exports.DIBadKeyError = DIBadKeyError;
	var emptyParameters = Object.freeze([]);
	exports.emptyParameters = emptyParameters;
	var instanceActivatorKey = "moby:instance-activator";
	var registrationKey = "moby:registration";
	var dependencyResolverKey = "moby:dependency-resolver";
	_metaMetadata.Metadata.instanceActivator = instanceActivatorKey;
	_metaMetadata.Metadata.registration = registrationKey;
	_metaMetadata.Metadata.dependencyResolver = dependencyResolverKey;

	class DIContainer {
	    constructor(info) {
	        this.entries = new Map();
	        this.constructionInfo = info || new Map();
	    }
	    get root() {
	        return null;
	    }
	    makeGlobal() {
	        DIContainer.instance = this;
	        return this;
	    }
	    /**
	    * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default singleton registration is used.
	    *
	    * @method autoRegister
	    * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
	    * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
	    */
	    autoRegister(fn, key, targetKey) {
	        var registration;
	        if (fn === null || fn === undefined) {
	            throw new DIBadKeyError();
	        }
	        if (typeof fn === 'function') {
	            registration = _metaMetadata.Metadata.get(registrationKey, fn, targetKey);
	            if (registration !== undefined) {
	                registration.register(this, key || fn, fn);
	            } else {
	                this.registerSingleton(key || fn, fn, targetKey);
	            }
	        } else {
	            this.registerInstance(fn, fn);
	        }
	    }
	    /**
	    * Unregisters based on key.
	    *
	    * @method unregister
	    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
	    */
	    unregister(key) {
	        this.entries['delete'](key);
	    }
	    /**
	    * Inspects the container to determine if a particular key has been registred.
	    *
	    * @method hasHandler
	    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
	    * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
	    * @return {Boolean} Returns true if the key has been registred; false otherwise.
	    */
	    hasHandler(key) {
	        var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	        if (key === null || key === undefined) {
	            throw new DIBadKeyError();
	        }
	        return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
	    }
	    /**
	    * Resolves a single instance based on the provided key.
	    *
	    * @method get
	    * @param {Object} key The key that identifies the object to resolve.
	    * @return {Object} Returns the resolved instance.
	    */
	    get(key) {
	        var entry;
	        if (key === null || key === undefined) {
	            throw new DIBadKeyError();
	        }
	        if (key === DIContainer) {
	            return this;
	        }
	        if (key instanceof _metadata.Resolver) {
	            return key.get(this);
	        }
	        entry = this.entries.get(key);
	        if (entry !== undefined) {
	            return entry[0](this);
	        }
	        if (this.parent && this.parent.hasHandler(key)) {
	            return this.parent.get(key);
	        }
	        // No point in registrering a string
	        if (typeof key === 'string') {
	            throw (0, _errors.createError)('DIResolveError', 'no component registered for key: ' + key);
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
	    getAll(key) {
	        var _this = this;

	        var entry;
	        if (key === null || key === undefined) {
	            throw new DIBadKeyError();
	        }
	        entry = this.entries.get(key);
	        if (entry !== undefined) {
	            return entry.map(function (x) {
	                return x(_this);
	            });
	        }
	        if (this.parent) {
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
	    createChild() {
	        var childContainer = new DIContainer(this.constructionInfo);
	        childContainer.parent = this;
	        //childContainer.root = this.root;
	        return childContainer;
	    }
	    resolveDependencies(fn, targetKey) {
	        var info = this._getOrCreateConstructionSet(fn, targetKey);
	        var keys = info.keys,
	            args = new Array(keys.length);
	        var i, ii;
	        try {
	            for (i = 0, ii = keys.length; i < ii; ++i) {
	                args[i] = this.get(keys[i]);
	            }
	        } catch (e) {
	            var message = "Error";
	            if (i < ii) {
	                message += ' The argument at index ' + i + ' (key:' + keys[i] + ') could not be satisfied.';
	            }
	            throw (0, _errors.createError)("DependencyError", message);
	        }
	        return args;
	    }
	    /**
	    * Invokes a function, recursively resolving its dependencies.
	    *
	    * @method invoke
	    * @param {Function} fn The function to invoke with the auto-resolved dependencies.
	    * @param {any[]} [deps] Additional function dependencies to use during invocation.
	    * @return {Object} Returns the instance resulting from calling the function.
	    */
	    invoke(fn, deps, targetKey) {
	        var info = this._getOrCreateConstructionSet(fn, targetKey);
	        try {
	            var keys, args;
	            if (info.dependencyResolver) {
	                args = info.dependencyResolver.resolveDependencies(fn);
	            } else {
	                args = this.resolveDependencies(fn, targetKey);
	            }
	            if (deps !== undefined && Array.isArray(deps)) {
	                args = args.concat(deps);
	            }
	            return info.activator.invoke(fn, args, targetKey, keys);
	        } catch (e) {
	            var activatingText = info.activator instanceof _metadata.ClassActivator ? 'instantiating' : 'invoking';
	            var message = 'Error ' + activatingText + ' ' + fn.name + '.';
	            message += ' Check the inner error for details.';
	            throw (0, _errors.createError)("DIInvokeError", message, [e]);
	        }
	    }
	    registerInstance(key, instance) {
	        this.registerHandler(key, function (x) {
	            return instance;
	        });
	    }
	    registerTransient(key, fn, targetKey) {
	        this.registerHandler(key, function (x) {
	            return x.invoke(fn, null, targetKey);
	        });
	    }
	    registerSingleton(key, fn, targetKey) {
	        var singleton;
	        this.registerHandler(key, function (x) {
	            return singleton || (singleton = x.invoke(fn, null, targetKey));
	        });
	    }
	    registerHandler(key, handler) {
	        this._getOrCreateEntry(key).push(handler);
	    }
	    _getOrCreateEntry(key) {
	        var entry;
	        if (key === null || key === undefined) {
	            throw new _errors.DIError('key cannot be null or undefined.  (Are you trying to inject something that doesn\'t exist with DI?)');
	        }
	        entry = this.entries.get(key);
	        if (entry === undefined) {
	            entry = [];
	            this.entries.set(key, entry);
	        }
	        return entry;
	    }
	    _getOrCreateConstructionSet(fn, targetKey) {
	        var info = this.constructionInfo.get(fn);
	        if (info === undefined) {
	            info = this._createConstructionSet(fn, targetKey);
	            this.constructionInfo.set(fn, info);
	        }
	        return info;
	    }
	    _createConstructionSet(fn, targetKey) {
	        var info = {
	            activator: _metaMetadata.Metadata.getOwn(_metaMetadata.Metadata.instanceActivator, fn, targetKey) || _metadata.ClassActivator.instance,
	            dependencyResolver: _metaMetadata.Metadata.getOwn(dependencyResolverKey, fn, targetKey) || this };
	        if (fn.inject !== undefined) {
	            if (typeof fn.inject === 'function') {
	                info.keys = fn.inject();
	            } else {
	                info.keys = fn.inject;
	            }
	            return info;
	        }
	        info.keys = _metaMetadata.Metadata.getOwn(_metaMetadata.Metadata.paramTypes, fn, targetKey) || getFunctionParameters(fn) || emptyParameters;
	        return info;
	    }
	}

	exports.DIContainer = DIContainer;

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	* Used to allow functions/classes to indicate that they should be registered as transients with the container.
	*
	* @class TransientRegistration
	* @constructor
	* @param {Object} [key] The key to register as.
	*/
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	class TransientRegistration {
	    constructor(key) {
	        this.key = key;
	    }
	    /**
	    * Called by the container to register the annotated function/class as transient.
	    *
	    * @method register
	    * @param {Container} container The container to register with.
	    * @param {Object} key The key to register as.
	    * @param {Object} fn The function to register (target of the annotation).
	    */
	    register(container, key, fn) {
	        container.registerTransient(this.key || key, fn);
	    }
	}

	/**
	* Used to allow functions/classes to indicate that they should be registered as singletons with the container.
	*
	* @class SingletonRegistration
	* @constructor
	* @param {Object} [key] The key to register as.
	*/
	exports.TransientRegistration = TransientRegistration;

	class SingletonRegistration {
	    constructor(keyOrRegisterInChild) {
	        var registerInChild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	        if (typeof keyOrRegisterInChild === 'boolean') {
	            this.registerInChild = keyOrRegisterInChild;
	        } else {
	            this.key = keyOrRegisterInChild;
	            this.registerInChild = registerInChild;
	        }
	    }
	    /**
	    * Called by the container to register the annotated function/class as a singleton.
	    *
	    * @method register
	    * @param {Container} container The container to register with.
	    * @param {Object} key The key to register as.
	    * @param {Object} fn The function to register (target of the annotation).
	    */
	    register(container, key, fn) {
	        var destination = this.registerInChild ? container : container.root;
	        destination.registerSingleton(this.key || key, fn);
	    }
	}

	/**
	* An abstract resolver used to allow functions/classes to specify custom dependency resolution logic.
	*
	* @class Resolver
	* @constructor
	*/
	exports.SingletonRegistration = SingletonRegistration;

	class Resolver {
	    /**
	    * Called by the container to allow custom resolution of dependencies for a function/class.
	    *
	    * @method get
	    * @param {Container} container The container to resolve from.
	    * @return {Object} Returns the resolved object.
	    */
	    get(container) {
	        throw new Error('A custom Resolver must implement get(container) and return the resolved instance(s).');
	    }
	}

	/**
	* Used to allow functions/classes to specify lazy resolution logic.
	*
	* @class Lazy
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to lazily resolve.
	*/
	exports.Resolver = Resolver;

	class Lazy extends Resolver {
	    constructor(key) {
	        super();
	        this.key = key;
	    }
	    /**
	    * Called by the container to lazily resolve the dependency into a lazy locator function.
	    *
	    * @method get
	    * @param {Container} container The container to resolve from.
	    * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
	    */
	    get(container) {
	        var _this = this;

	        return function () {
	            return container.get(_this.key);
	        };
	    }
	    /**
	    * Creates a Lazy Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to lazily resolve.
	    * @return {Lazy} Returns an insance of Lazy for the key.
	    */
	    static of(key) {
	        return new Lazy(key);
	    }
	}

	/**
	* Used to allow functions/classes to specify resolution of all matches to a key.
	*
	* @class All
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to lazily resolve all matches for.
	*/
	exports.Lazy = Lazy;

	class All extends Resolver {
	    constructor(key) {
	        super();
	        this.key = key;
	    }
	    /**
	    * Called by the container to resolve all matching dependencies as an array of instances.
	    *
	    * @method get
	    * @param {Container} container The container to resolve from.
	    * @return {Object[]} Returns an array of all matching instances.
	    */
	    get(container) {
	        return container.getAll(this.key);
	    }
	    /**
	    * Creates an All Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to resolve all instances for.
	    * @return {All} Returns an insance of All for the key.
	    */
	    static of(key) {
	        return new All(key);
	    }
	}

	/**
	* Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
	*
	* @class Optional
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to optionally resolve for.
	* @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
	*/
	exports.All = All;

	class Optional extends Resolver {
	    constructor(key) {
	        var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	        super();
	        this.key = key;
	        this.checkParent = checkParent;
	    }
	    /**
	    * Called by the container to provide optional resolution of the key.
	    *
	    * @method get
	    * @param {Container} container The container to resolve from.
	    * @return {Object} Returns the instance if found; otherwise null.
	    */
	    get(container) {
	        if (container.hasHandler(this.key, this.checkParent)) {
	            return container.get(this.key);
	        }
	        return null;
	    }
	    /**
	    * Creates an Optional Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to optionally resolve for.
	    * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
	    * @return {Optional} Returns an insance of Optional for the key.
	    */
	    static of(key) {
	        var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	        return new Optional(key, checkParent);
	    }
	}

	/**
	* Used to inject the dependency from the parent container instead of the current one.
	*
	* @class Parent
	* @constructor
	* @extends Resolver
	* @param {Object} key The key to resolve from the parent container.
	*/
	exports.Optional = Optional;

	class Parent extends Resolver {
	    constructor(key) {
	        super();
	        this.key = key;
	    }
	    /**
	    * Called by the container to load the dependency from the parent container
	    *
	    * @method get
	    * @param {Container} container The container to resolve the parent from.
	    * @return {Function} Returns the matching instance from the parent container
	    */
	    get(container) {
	        return container.parent ? container.parent.get(this.key) : null;
	    }
	    /**
	    * Creates a Parent Resolver for the supplied key.
	    *
	    * @method of
	    * @static
	    * @param {Object} key The key to resolve.
	    * @return {Parent} Returns an insance of Parent for the key.
	    */
	    static of(key) {
	        return new Parent(key);
	    }
	}

	/**
	* Used to instantiate a class.
	*
	* @class ClassActivator
	* @constructor
	*/
	exports.Parent = Parent;

	class ClassActivator {
	    invoke(fn, args) {
	        return Reflect.construct(fn, args);
	    }
	}

	exports.ClassActivator = ClassActivator;

	ClassActivator.instance = new ClassActivator();
	/**
	* Used to invoke a factory method.
	*
	* @class FactoryActivator
	* @constructor
	*/

	class FactoryActivator {
	    invoke(fn, args) {
	        return fn.apply(undefined, args);
	    }
	}

	exports.FactoryActivator = FactoryActivator;

	FactoryActivator.instance = new FactoryActivator();

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	var _bind = Function.prototype.bind;

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	var theGlobal = (function () {
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
	var emptyMetadata = Object.freeze({});
	var metadataContainerKey = '__metadata__';
	if (typeof theGlobal.System === 'undefined') {
	    theGlobal.System = { isFake: true };
	}
	if (typeof theGlobal.System.forEachModule === 'undefined') {
	    theGlobal.System.forEachModule = function () {};
	}
	if (typeof theGlobal.Reflect === 'undefined') {
	    theGlobal.Reflect = {};
	}
	if (typeof theGlobal.Reflect.getOwnMetadata === 'undefined') {
	    Reflect.getOwnMetadata = function (metadataKey, target, targetKey) {
	        return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
	    };
	}
	if (typeof theGlobal.Reflect.defineMetadata === 'undefined') {
	    Reflect.defineMetadata = function (metadataKey, metadataValue, target, targetKey) {
	        var metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : target[metadataContainerKey] = {};
	        var targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
	        targetContainer[metadataKey] = metadataValue;
	    };
	}
	if (typeof theGlobal.Reflect.metadata === 'undefined') {
	    Reflect.metadata = function (metadataKey, metadataValue) {
	        return function (target, targetKey) {
	            Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
	        };
	    };
	}
	if (typeof theGlobal.Reflect.construct) {
	    Reflect.construct = function (fn, args) {
	        return new (_bind.apply(fn, [null].concat(_toConsumableArray(args))))();
	    };
	}
	function ensureDecorators(target) {
	    var applicator;
	    if (typeof target.decorators === 'function') {
	        applicator = target.decorators();
	    } else {
	        applicator = target.decorators;
	    }
	    if (typeof applicator._decorate === 'function') {
	        delete target.decorators;
	        applicator._decorate(target);
	    } else {
	        throw new Error('The return value of your decorator\'s method was not valid.');
	    }
	}
	/**
	* Provides helpers for working with metadata.
	*
	* @class Metadata
	* @static
	*/
	var Metadata = {
	    global: theGlobal,
	    noop: function noop() {},
	    resource: 'aurelia:resource',
	    paramTypes: 'design:paramtypes',
	    properties: 'design:properties',
	    get: function get(metadataKey, target, targetKey) {
	        if (!target) {
	            return undefined;
	        }
	        var result = Metadata.getOwn(metadataKey, target, targetKey);
	        return result === undefined ? Metadata.get(metadataKey, Object.getPrototypeOf(target), targetKey) : result;
	    },
	    getOwn: function getOwn(metadataKey, target, targetKey) {
	        if (!target) {
	            return undefined;
	        }
	        if (target.hasOwnProperty('decorators')) {
	            ensureDecorators(target);
	        }
	        return Reflect.getOwnMetadata(metadataKey, target, targetKey);
	    },
	    define: function define(metadataKey, metadataValue, target, targetKey) {
	        Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
	    },
	    getOrCreateOwn: function getOrCreateOwn(metadataKey, Type, target, targetKey) {
	        var result = Metadata.getOwn(metadataKey, target, targetKey);
	        if (result === undefined) {
	            result = new Type();
	            Reflect.defineMetadata(metadataKey, result, target, targetKey);
	        }
	        return result;
	    }
	};
	exports.Metadata = Metadata;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.createError = createError;

	class DIError extends Error {
	    constructor(message) {
	        super(message);
	        this.message = message;
	    }
	    toString() {
	        return "[" + this.name + ": " + this.message + "]";
	    }
	}

	exports.DIError = DIError;

	class DIAggregateError extends DIError {
	    constructor(message, errors) {
	        super(message);
	        this.errors = errors;
	    }
	    toString() {
	        return "[" + this.name + ": " + this.message + "], errors:" + this.errors;
	    }
	}

	exports.DIAggregateError = DIAggregateError;

	function createError(name, message, errors) {
	    var e = undefined;
	    if (errors) {
	        e = new DIAggregateError(message, errors);
	    } else {
	        e = new DIError(message);
	    }
	    e.name = name;
	    return e;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

	var _metadata = __webpack_require__(3);

	_defaults(exports, _interopExportWildcard(_metadata, _defaults));

	var _decorators = __webpack_require__(6);

	_defaults(exports, _interopExportWildcard(_decorators, _defaults));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});

	var _decoratorApplicator = __webpack_require__(7);

	var Decorators = {
	    configure: {
	        parameterizedDecorator: function parameterizedDecorator(name, decorator) {
	            Decorators[name] = function () {
	                var applicator = new _decoratorApplicator.DecoratorApplicator();
	                return applicator[name].apply(applicator, arguments);
	            };
	            _decoratorApplicator.DecoratorApplicator.prototype[name] = function () {
	                var result = decorator.apply(null, arguments);
	                return this.decorator(result);
	            };
	        },
	        simpleDecorator: function simpleDecorator(name, decorator) {
	            Decorators[name] = function () {
	                return new _decoratorApplicator.DecoratorApplicator().decorator(decorator);
	            };
	            _decoratorApplicator.DecoratorApplicator.prototype[name] = function () {
	                return this.decorator(decorator);
	            };
	        }
	    }
	};
	exports.Decorators = Decorators;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	class DecoratorApplicator {
	    constructor() {
	        this._first = null;
	        this._second = null;
	        this._third = null;
	        this._rest = null;
	    }
	    decorator(decorator) {
	        if (this._first === null) {
	            this._first = decorator;
	            return this;
	        }
	        if (this._second === null) {
	            this._second = decorator;
	            return this;
	        }
	        if (this._third === null) {
	            this._third = decorator;
	            return this;
	        }
	        if (this._rest === null) {
	            this._rest = [];
	        }
	        this._rest.push(decorator);
	        return this;
	    }
	    _decorate(target) {
	        var i, ii, rest;
	        if (this._first !== null) {
	            this._first(target);
	        }
	        if (this._second !== null) {
	            this._second(target);
	        }
	        if (this._third !== null) {
	            this._third(target);
	        }
	        rest = this._rest;
	        if (rest !== null) {
	            for (i = 0, ii = rest.length; i < ii; ++i) {
	                rest[i](target);
	            }
	        }
	    }
	}

	exports.DecoratorApplicator = DecoratorApplicator;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	exports.autoinject = autoinject;
	exports.inject = inject;
	exports.registration = registration;
	exports.transient = transient;
	exports.singleton = singleton;
	exports.instanceActivator = instanceActivator;
	exports.factory = factory;

	var _metaIndex = __webpack_require__(5);

	var _metadata = __webpack_require__(2);

	var _container = __webpack_require__(1);

	function autoinject(target) {
	    var deco = function deco(target) {
	        target.inject = _metaIndex.Metadata.getOwn(_metaIndex.Metadata.paramTypes, target) || _container.emptyParameters;
	    };
	    return target ? deco(target) : deco;
	}

	function inject() {
	    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
	        rest[_key] = arguments[_key];
	    }

	    return function (target) {
	        target.inject = rest;
	    };
	}

	function registration(value, targetKey) {
	    return function (target) {
	        _metaIndex.Metadata.define(_metaIndex.Metadata.registration, value, target, targetKey);
	    };
	}

	function transient(key, targetKey) {
	    return registration(new _metadata.TransientRegistration(key), targetKey);
	}

	function singleton(keyOrRegisterInChild, registerInChild, targetKey) {
	    if (registerInChild === undefined) registerInChild = false;

	    return registration(new _metadata.SingletonRegistration(keyOrRegisterInChild, registerInChild), targetKey);
	}

	function instanceActivator(value, targetKey) {
	    return function (target) {
	        _metaIndex.Metadata.define(_metaIndex.Metadata.instanceActivator, value, target, targetKey);
	    };
	}

	function factory() {
	    return instanceActivator(_metadata.FactoryActivator.instance);
	}

	_metaIndex.Decorators.configure.simpleDecorator('autoinject', autoinject);
	_metaIndex.Decorators.configure.parameterizedDecorator('inject', inject);
	_metaIndex.Decorators.configure.parameterizedDecorator('registration', registration);
	_metaIndex.Decorators.configure.parameterizedDecorator('transient', transient);
	_metaIndex.Decorators.configure.parameterizedDecorator('singleton', singleton);
	_metaIndex.Decorators.configure.parameterizedDecorator('instanceActivator', instanceActivator);
	_metaIndex.Decorators.configure.parameterizedDecorator('factory', factory);

/***/ }
/******/ ]);