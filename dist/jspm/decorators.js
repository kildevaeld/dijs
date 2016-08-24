"use strict";

define(["require", "exports", './meta/index', './metadata', './container'], function (require, exports, index_1, metadata_1, container_1) {
    "use strict";

    function autoinject(target) {
        var deco = function deco(target) {
            target.inject = index_1.Metadata.getOwn(index_1.Metadata.paramTypes, target) || container_1.emptyParameters;
        };
        return target ? deco(target) : deco;
    }
    exports.autoinject = autoinject;
    function inject() {
        for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
            rest[_key] = arguments[_key];
        }

        return function (target) {
            target.inject = rest;
        };
    }
    exports.inject = inject;
    function registration(value, targetKey) {
        return function (target) {
            index_1.Metadata.define(index_1.Metadata.registration, value, target, targetKey);
        };
    }
    exports.registration = registration;
    function transient(key, targetKey) {
        return registration(new metadata_1.TransientRegistration(key), targetKey);
    }
    exports.transient = transient;
    function singleton(keyOrRegisterInChild) {
        var registerInChild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var targetKey = arguments[2];

        return registration(new metadata_1.SingletonRegistration(keyOrRegisterInChild, registerInChild), targetKey);
    }
    exports.singleton = singleton;
    function instanceActivator(value, targetKey) {
        return function (target) {
            index_1.Metadata.define(index_1.Metadata.instanceActivator, value, target, targetKey);
        };
    }
    exports.instanceActivator = instanceActivator;
    function factory() {
        return instanceActivator(metadata_1.FactoryActivator.instance);
    }
    exports.factory = factory;
    index_1.Decorators.configure.simpleDecorator('autoinject', autoinject);
    index_1.Decorators.configure.parameterizedDecorator('inject', inject);
    index_1.Decorators.configure.parameterizedDecorator('registration', registration);
    index_1.Decorators.configure.parameterizedDecorator('transient', transient);
    index_1.Decorators.configure.parameterizedDecorator('singleton', singleton);
    index_1.Decorators.configure.parameterizedDecorator('instanceActivator', instanceActivator);
    index_1.Decorators.configure.parameterizedDecorator('factory', factory);
});