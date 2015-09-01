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

var _metaIndex = require('./meta/index');

var _metadata = require('./metadata');

var _container = require('./container');

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