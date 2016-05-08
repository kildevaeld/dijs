/// <reference path="../typings/browser.d.ts" />
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.getFunctionParameters = getFunctionParameters;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _metadata = require('./metadata');

var _metaMetadata = require('./meta/metadata');

var _errors = require('./errors');

var debug = require('debug')('stick:di');
var idCounter = 0;
function gen_id() {
    return "di" + ++idCounter;
}
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

var DIBadKeyError = (function (_DIError) {
    _inherits(DIBadKeyError, _DIError);

    function DIBadKeyError(message) {
        _classCallCheck(this, DIBadKeyError);

        _DIError.call(this, message);
        this.name = 'BadKeyError';
        this.message = "key not registered with container";
    }

    return DIBadKeyError;
})(_errors.DIError);

exports.DIBadKeyError = DIBadKeyError;
var emptyParameters = Object.freeze([]);
exports.emptyParameters = emptyParameters;

var DIContainer = (function () {
    function DIContainer(info) {
        _classCallCheck(this, DIContainer);

        this._id = gen_id();
        this.entries = new Map();
        this.constructionInfo = info || new Map();
        debug("Creating new container: %s", this.id);
    }

    DIContainer.prototype.makeGlobal = function makeGlobal() {
        debug("%s: Make global", this.id);
        DIContainer.instance = this;
        return this;
    };

    /**
    * Registers a type (constructor function) by inspecting its registration annotations. If none are found, then the default singleton registration is used.
    *
    * @method autoRegister
    * @param {Function} fn The constructor function to use when the dependency needs to be instantiated.
    * @param {Object} [key] The key that identifies the dependency at resolution time; usually a constructor function.
    */

    DIContainer.prototype.autoRegister = function autoRegister(fn, key, targetKey) {
        var registration;
        if (fn === null || fn === undefined) {
            throw new DIBadKeyError('no key');
        }
        if (typeof fn === 'function') {
            registration = _metaMetadata.Metadata.get(_metaMetadata.Metadata.registration, fn, targetKey);
            if (registration !== undefined) {
                registration.register(this, key || fn, fn);
            } else {
                this.registerSingleton(key || fn, fn, targetKey);
            }
        } else {
            this.registerInstance(fn, fn);
        }
    };

    /**
    * Unregisters based on key.
    *
    * @method unregister
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    */

    DIContainer.prototype.unregister = function unregister(key) {
        debug('%s: Unregister key: %s', this.id, key);
        this.entries['delete'](key);
    };

    /**
    * Inspects the container to determine if a particular key has been registred.
    *
    * @method hasHandler
    * @param {Object} key The key that identifies the dependency at resolution time; usually a constructor function.
    * @param {Boolean} [checkParent=false] Indicates whether or not to check the parent container hierarchy.
    * @return {Boolean} Returns true if the key has been registred; false otherwise.
    */

    DIContainer.prototype.hasHandler = function hasHandler(key) {
        var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        if (key === null || key === undefined) {
            throw new DIBadKeyError();
        }
        return this.entries.has(key) || checkParent && this.parent && this.parent.hasHandler(key, checkParent);
    };

    /**
    * Resolves a single instance based on the provided key.
    *
    * @method get
    * @param {Object} key The key that identifies the object to resolve.
    * @return {Object} Returns the resolved instance.
    */

    DIContainer.prototype.get = function get(key, targetKey) {
        debug("%s: Get %s, target: %s", this.id, String(key), targetKey);
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
            debug("%s: found key '%s' on parent", this.id, key);
            return this.parent.get(key, targetKey);
        }
        // No point in registrering a string
        if (typeof key === 'string') {
            throw (0, _errors.createError)('DIResolveError', 'no component registered for key: ' + key);
        }
        this.autoRegister(key, targetKey);
        entry = this.entries.get(key);
        return entry[0](this);
    };

    /**
    * Resolves all instance registered under the provided key.
    *
    * @method getAll
    * @param {Object} key The key that identifies the objects to resolve.
    * @return {Object[]} Returns an array of the resolved instances.
    */

    DIContainer.prototype.getAll = function getAll(key) {
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
    };

    /**
    * Creates a new dependency injection container whose parent is the current container.
    *
    * @method createChild
    * @return {Container} Returns a new container instance parented to this.
    */

    DIContainer.prototype.createChild = function createChild() {
        var childContainer = new DIContainer(this.constructionInfo);
        childContainer.parent = this;
        debug("%s: Create child container: %s", this.id, childContainer.id);
        return childContainer;
    };

    /**
     * Resolve dependencies for the given function
     * @method resolveDependencies
     * @param {Function} fn
     * @return {Array<any>}
     */

    DIContainer.prototype.resolveDependencies = function resolveDependencies(fn, targetKey) {
        debug("%s: Resolve dependencies for: %j", this.id, fn.name);
        var info = this._getOrCreateConstructionSet(fn, targetKey),
            keys = info.keys,
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
            debug('resolve error %s', e);
            throw (0, _errors.createError)("DependencyError", message, [e]);
        }
        return args;
    };

    /**
    * Invokes a function, recursively resolving its dependencies.
    *
    * @method invoke
    * @param {Function} fn The function to invoke with the auto-resolved dependencies.
    * @param {any[]} [deps] Additional function dependencies to use during invocation.
    * @return {Object} Returns the instance resulting from calling the function.
    */

    DIContainer.prototype.invoke = function invoke(fn, deps, targetKey) {
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
            debug("%s: invoking '%s', with dependencies:", this.id, fn.name, info.keys);
            return info.activator.invoke(fn, args, targetKey, keys);
        } catch (e) {
            var activatingText = info.activator instanceof _metadata.ClassActivator ? 'instantiating' : 'invoking';
            var message = 'Error ' + activatingText + ' ' + fn.name + '.';
            debug('invoke error %s', e);
            message += ' Check the inner error for details.';
            throw (0, _errors.createError)("DIInvokeError", message, [e]);
        }
    };

    DIContainer.prototype.registerInstance = function registerInstance(key, instance) {
        debug("%s: Register instance %s", this.id, key);
        this.registerHandler(key, function (x) {
            return instance;
        });
    };

    DIContainer.prototype.registerTransient = function registerTransient(key, fn, targetKey) {
        debug("%s: Register transient %s", this.id, key);
        this.registerHandler(key, function (x) {
            return x.invoke(fn, null, targetKey);
        });
    };

    DIContainer.prototype.registerSingleton = function registerSingleton(key, fn, targetKey) {
        debug("%s: Register singleton %s", this.id, key);
        var singleton;
        this.registerHandler(key, function (x) {
            return singleton || (singleton = x.invoke(fn, null, targetKey));
        });
    };

    DIContainer.prototype.registerHandler = function registerHandler(key, handler) {
        this._getOrCreateEntry(key).push(handler);
    };

    DIContainer.prototype._getOrCreateEntry = function _getOrCreateEntry(key) {
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
    };

    DIContainer.prototype._getOrCreateConstructionSet = function _getOrCreateConstructionSet(fn, targetKey) {
        var info = this.constructionInfo.get(fn);
        if (info === undefined) {
            info = this._createConstructionSet(fn, targetKey);
            this.constructionInfo.set(fn, info);
        }
        return info;
    };

    DIContainer.prototype._createConstructionSet = function _createConstructionSet(fn, targetKey) {
        var info = {
            activator: _metaMetadata.Metadata.getOwn(_metaMetadata.Metadata.instanceActivator, fn, targetKey) || _metadata.ClassActivator.instance,
            dependencyResolver: _metaMetadata.Metadata.getOwn(_metaMetadata.Metadata.dependencyResolver, fn, targetKey) || this
        };
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
    };

    _createClass(DIContainer, [{
        key: 'root',
        get: function get() {
            var root = this,
                tmp = root;
            while (tmp) {
                tmp = root.parent;
                if (tmp) root = tmp;
            }
            return root;
        }
    }, {
        key: 'id',
        get: function get() {
            return this._id;
        }
    }]);

    return DIContainer;
})();

exports.DIContainer = DIContainer;