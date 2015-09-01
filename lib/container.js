'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _metadata = require('./metadata');

var _metaMetadata = require('./meta/metadata');

var _errors = require('./errors');

// Fix Function#name on browsers that do not support it (IE):
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
var emptyParameters = Object.freeze([]);
exports.emptyParameters = emptyParameters;
var instanceActivatorKey = "moby:instance-activator";
var registrationKey = "moby:registration";
_metaMetadata.Metadata.instanceActivator = instanceActivatorKey;
_metaMetadata.Metadata.registration = registrationKey;

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
            throw new Error('badKeyError');
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
            throw new Error('badKeyError');
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
            throw new Error('badKeyError');
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
            throw new Error('badKeyError');
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
            var keys = info.keys,
                args = new Array(keys.length),
                i,
                ii;
            for (i = 0, ii = keys.length; i < ii; ++i) {
                args[i] = this.get(keys[i]);
            }
            if (deps !== undefined && Array.isArray(deps)) {
                args = args.concat(deps);
            }
            return info.activator.invoke(fn, args, targetKey, keys);
        } catch (e) {
            var activatingText = info.activator instanceof _metadata.ClassActivator ? 'instantiating' : 'invoking';
            var message = 'Error ' + activatingText + ' ' + fn.name + '.';
            if (i < ii) {
                message += ' The argument at index ' + i + ' (key:' + keys[i] + ') could not be satisfied.';
            }
            message += ' Check the inner error for details.';
            console.log(e);
            e = (0, _errors.createError)("DIInvokeError", message, [e]);
            throw e;
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
        var info = { activator: _metaMetadata.Metadata.getOwn(_metaMetadata.Metadata.instanceActivator, fn, targetKey) || _metadata.ClassActivator.instance };
        if (fn.inject !== undefined) {
            if (typeof fn.inject === 'function') {
                info.keys = fn.inject();
            } else {
                info.keys = fn.inject;
            }
            return info;
        }
        info.keys = _metaMetadata.Metadata.getOwn(_metaMetadata.Metadata.paramTypes, fn, targetKey) || emptyParameters;
        return info;
    }
}

exports.DIContainer = DIContainer;