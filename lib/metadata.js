"use strict";
/**
* Used to allow functions/classes to indicate that they should be registered as transients with the container.
*
* @class TransientRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransientRegistration = function () {
    function TransientRegistration(key) {
        _classCallCheck(this, TransientRegistration);

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


    _createClass(TransientRegistration, [{
        key: 'register',
        value: function register(container, key, fn) {
            container.registerTransient(this.key || key, fn);
        }
    }]);

    return TransientRegistration;
}();

exports.TransientRegistration = TransientRegistration;
/**
* Used to allow functions/classes to indicate that they should be registered as singletons with the container.
*
* @class SingletonRegistration
* @constructor
* @param {Object} [key] The key to register as.
*/

var SingletonRegistration = function () {
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
    * Called by the container to register the annotated function/class as a singleton.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */


    _createClass(SingletonRegistration, [{
        key: 'register',
        value: function register(container, key, fn) {
            var destination = this.registerInChild ? container : container.root;
            destination.registerSingleton(this.key || key, fn);
        }
    }]);

    return SingletonRegistration;
}();

exports.SingletonRegistration = SingletonRegistration;
/**
* An abstract resolver used to allow functions/classes to specify custom dependency resolution logic.
*
* @class Resolver
* @constructor
*/

var Resolver = function () {
    function Resolver() {
        _classCallCheck(this, Resolver);
    }

    _createClass(Resolver, [{
        key: 'get',

        /**
        * Called by the container to allow custom resolution of dependencies for a function/class.
        *
        * @method get
        * @param {Container} container The container to resolve from.
        * @return {Object} Returns the resolved object.
        */
        value: function get(container) {
            throw new Error('A custom Resolver must implement get(container) and return the resolved instance(s).');
        }
    }]);

    return Resolver;
}();

exports.Resolver = Resolver;
/**
* Used to allow functions/classes to specify lazy resolution logic.
*
* @class Lazy
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve.
*/

var Lazy = function (_Resolver) {
    _inherits(Lazy, _Resolver);

    function Lazy(key) {
        _classCallCheck(this, Lazy);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Lazy).call(this));

        _this.key = key;
        return _this;
    }
    /**
    * Called by the container to lazily resolve the dependency into a lazy locator function.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Function} Returns a function which can be invoked at a later time to obtain the actual dependency.
    */


    _createClass(Lazy, [{
        key: 'get',
        value: function get(container) {
            var _this2 = this;

            return function () {
                return container.get(_this2.key);
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

    }], [{
        key: 'of',
        value: function of(key) {
            return new Lazy(key);
        }
    }]);

    return Lazy;
}(Resolver);

exports.Lazy = Lazy;
/**
* Used to allow functions/classes to specify resolution of all matches to a key.
*
* @class All
* @constructor
* @extends Resolver
* @param {Object} key The key to lazily resolve all matches for.
*/

var All = function (_Resolver2) {
    _inherits(All, _Resolver2);

    function All(key) {
        _classCallCheck(this, All);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(All).call(this));

        _this3.key = key;
        return _this3;
    }
    /**
    * Called by the container to resolve all matching dependencies as an array of instances.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object[]} Returns an array of all matching instances.
    */


    _createClass(All, [{
        key: 'get',
        value: function get(container) {
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

    }], [{
        key: 'of',
        value: function of(key) {
            return new All(key);
        }
    }]);

    return All;
}(Resolver);

exports.All = All;
/**
* Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
*
* @class Optional
* @constructor
* @extends Resolver
* @param {Object} key The key to optionally resolve for.
* @param {Boolean} [checkParent=false] Indicates whether or not the parent container hierarchy should be checked.
*/

var Optional = function (_Resolver3) {
    _inherits(Optional, _Resolver3);

    function Optional(key) {
        var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        _classCallCheck(this, Optional);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Optional).call(this));

        _this4.key = key;
        _this4.checkParent = checkParent;
        return _this4;
    }
    /**
    * Called by the container to provide optional resolution of the key.
    *
    * @method get
    * @param {Container} container The container to resolve from.
    * @return {Object} Returns the instance if found; otherwise null.
    */


    _createClass(Optional, [{
        key: 'get',
        value: function get(container) {
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

    }], [{
        key: 'of',
        value: function of(key) {
            var checkParent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            return new Optional(key, checkParent);
        }
    }]);

    return Optional;
}(Resolver);

exports.Optional = Optional;
/**
* Used to inject the dependency from the parent container instead of the current one.
*
* @class Parent
* @constructor
* @extends Resolver
* @param {Object} key The key to resolve from the parent container.
*/

var Parent = function (_Resolver4) {
    _inherits(Parent, _Resolver4);

    function Parent(key) {
        _classCallCheck(this, Parent);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Parent).call(this));

        _this5.key = key;
        return _this5;
    }
    /**
    * Called by the container to load the dependency from the parent container
    *
    * @method get
    * @param {Container} container The container to resolve the parent from.
    * @return {Function} Returns the matching instance from the parent container
    */


    _createClass(Parent, [{
        key: 'get',
        value: function get(container) {
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

    }], [{
        key: 'of',
        value: function of(key) {
            return new Parent(key);
        }
    }]);

    return Parent;
}(Resolver);

exports.Parent = Parent;
/**
* Used to instantiate a class.
*
* @class ClassActivator
* @constructor
*/

var ClassActivator = function () {
    function ClassActivator() {
        _classCallCheck(this, ClassActivator);
    }

    _createClass(ClassActivator, [{
        key: 'invoke',
        value: function invoke(fn, args) {
            return Reflect.construct(fn, args);
        }
    }]);

    return ClassActivator;
}();

ClassActivator.instance = new ClassActivator();
exports.ClassActivator = ClassActivator;
/**
* Used to invoke a factory method.
*
* @class FactoryActivator
* @constructor
*/

var FactoryActivator = function () {
    function FactoryActivator() {
        _classCallCheck(this, FactoryActivator);
    }

    _createClass(FactoryActivator, [{
        key: 'invoke',
        value: function invoke(fn, args) {
            return fn.apply(undefined, args);
        }
    }]);

    return FactoryActivator;
}();

FactoryActivator.instance = new FactoryActivator();
exports.FactoryActivator = FactoryActivator;