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

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TransientRegistration = (function () {
    function TransientRegistration(key) {
        _classCallCheck(this, TransientRegistration);

        this.key = key;
    }

    /**
    * Used to allow functions/classes to indicate that they should be registered as singletons with the container.
    *
    * @class SingletonRegistration
    * @constructor
    * @param {Object} [key] The key to register as.
    */

    /**
    * Called by the container to register the annotated function/class as transient.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */

    TransientRegistration.prototype.register = function register(container, key, fn) {
        container.registerTransient(this.key || key, fn);
    };

    return TransientRegistration;
})();

exports.TransientRegistration = TransientRegistration;

var SingletonRegistration = (function () {
    function SingletonRegistration(keyOrRegisterInChild) {
        var registerInChild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, SingletonRegistration);

        if (typeof keyOrRegisterInChild === 'boolean') {
            this.registerInChild = keyOrRegisterInChild;
        } else {
            this.key = keyOrRegisterInChild;
            this.registerInChild = registerInChild;
        }
    }

    /**
    * An abstract resolver used to allow functions/classes to specify custom dependency resolution logic.
    *
    * @class Resolver
    * @constructor
    */

    /**
    * Called by the container to register the annotated function/class as a singleton.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */

    SingletonRegistration.prototype.register = function register(container, key, fn) {
        var destination = this.registerInChild ? container : container.root;
        destination.registerSingleton(this.key || key, fn);
    };

    return SingletonRegistration;
})();

exports.SingletonRegistration = SingletonRegistration;

var Resolver = (function () {
    function Resolver() {
        _classCallCheck(this, Resolver);
    }

    /**
    * Used to allow functions/classes to specify lazy resolution logic.
    *
    * @class Lazy
    * @constructor
    * @extends Resolver
    * @param {Object} key The key to lazily resolve.
    */

    /**
    * Called by the container to allow custom resolution of dependencies for a function/class.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object} Returns the resolved object.
    */

    Resolver.prototype.get = function get(container) {
        throw new Error('A custom Resolver must implement get(container) and return the resolved instance(s).');
    };

    return Resolver;
})();

exports.Resolver = Resolver;

var Lazy = (function (_Resolver) {
    _inherits(Lazy, _Resolver);

    function Lazy(key) {
        _classCallCheck(this, Lazy);

        _Resolver.call(this);
        this.key = key;
    }

    /**
    * Used to allow functions/classes to specify resolution of all matches to a key.
    *
    * @class All
    * @constructor
    * @extends Resolver
    * @param {Object} key The key to lazily resolve all matches for.
    */

    /**
    * Called by the container to lazily resolve the dependency into a lazy locator function.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
    */

    Lazy.prototype.get = function get(container) {
        var _this = this;

        return function () {
            return container.get(_this.key);
        };
    };

    /**
    * Creates a Lazy Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to lazily resolve.
    * @return {Lazy} Returns an insance of Lazy for the key.
    */

    Lazy.of = function of(key) {
        return new Lazy(key);
    };

    return Lazy;
})(Resolver);

exports.Lazy = Lazy;

var All = (function (_Resolver2) {
    _inherits(All, _Resolver2);

    function All(key) {
        _classCallCheck(this, All);

        _Resolver2.call(this);
        this.key = key;
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

    /**
    * Called by the container to resolve all matching dependencies as an array of instances.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object[]} Returns an array of all matching instances.
    */

    All.prototype.get = function get(container) {
        return container.getAll(this.key);
    };

    /**
    * Creates an All Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve all instances for.
    * @return {All} Returns an insance of All for the key.
    */

    All.of = function of(key) {
        return new All(key);
    };

    return All;
})(Resolver);

exports.All = All;

var Optional = (function (_Resolver3) {
    _inherits(Optional, _Resolver3);

    function Optional(key) {
        var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, Optional);

        _Resolver3.call(this);
        this.key = key;
        this.checkParent = checkParent;
    }

    /**
    * Used to inject the dependency from the parent container instead of the current one.
    *
    * @class Parent
    * @constructor
    * @extends Resolver
    * @param {Object} key The key to resolve from the parent container.
    */

    /**
    * Called by the container to provide optional resolution of the key.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object} Returns the instance if found; otherwise null.
    */

    Optional.prototype.get = function get(container) {
        if (container.hasHandler(this.key, this.checkParent)) {
            return container.get(this.key);
        }
        return null;
    };

    /**
    * Creates an Optional Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to optionally resolve for.
    * @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
    * @return {Optional} Returns an insance of Optional for the key.
    */

    Optional.of = function of(key) {
        var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        return new Optional(key, checkParent);
    };

    return Optional;
})(Resolver);

exports.Optional = Optional;

var Parent = (function (_Resolver4) {
    _inherits(Parent, _Resolver4);

    function Parent(key) {
        _classCallCheck(this, Parent);

        _Resolver4.call(this);
        this.key = key;
    }

    /**
    * Used to instantiate a class.
    *
    * @class ClassActivator
    * @constructor
    */

    /**
    * Called by the container to load the dependency from the parent container
    *
    * @method get
    * @param {Container} container The container to resolve the parent from.
    * @return {Function} Returns the matching instance from the parent container
    */

    Parent.prototype.get = function get(container) {
        return container.parent ? container.parent.get(this.key) : null;
    };

    /**
    * Creates a Parent Resolver for the supplied key.
    *
    * @method of
    * @static
    * @param {Object} key The key to resolve.
    * @return {Parent} Returns an insance of Parent for the key.
    */

    Parent.of = function of(key) {
        return new Parent(key);
    };

    return Parent;
})(Resolver);

exports.Parent = Parent;

var ClassActivator = (function () {
    function ClassActivator() {
        _classCallCheck(this, ClassActivator);
    }

    ClassActivator.prototype.invoke = function invoke(fn, args) {
        return Reflect.construct(fn, args);
    };

    return ClassActivator;
})();

exports.ClassActivator = ClassActivator;

ClassActivator.instance = new ClassActivator();
/**
* Used to invoke a factory method.
*
* @class FactoryActivator
* @constructor
*/

var FactoryActivator = (function () {
    function FactoryActivator() {
        _classCallCheck(this, FactoryActivator);
    }

    FactoryActivator.prototype.invoke = function invoke(fn, args) {
        return fn.apply(undefined, args);
    };

    return FactoryActivator;
})();

exports.FactoryActivator = FactoryActivator;

FactoryActivator.instance = new FactoryActivator();