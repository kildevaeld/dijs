'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.autoinject = autoinject;
exports.inject = inject;
exports.registration = registration;
exports.transient = transient;
exports.singleton = singleton;
exports.instanceActivator = instanceActivator;
exports.factory = factory;

var _index = require('./meta/index');

var _metadata = require('./metadata');

var _container = require('./container');

function autoinject(target) {
    var deco = function deco(target) {
        target.inject = _index.Metadata.getOwn(_index.Metadata.paramTypes, target) || _container.emptyParameters;
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
        _index.Metadata.define(_index.Metadata.registration, value, target, targetKey);
    };
}
function transient(key, targetKey) {
    return registration(new _metadata.TransientRegistration(key), targetKey);
}
function singleton(keyOrRegisterInChild) {
    var registerInChild = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    var targetKey = arguments[2];

    return registration(new _metadata.SingletonRegistration(keyOrRegisterInChild, registerInChild), targetKey);
}
function instanceActivator(value, targetKey) {
    return function (target) {
        _index.Metadata.define(_index.Metadata.instanceActivator, value, target, targetKey);
    };
}
function factory() {
    return instanceActivator(_metadata.FactoryActivator.instance);
}
_index.Decorators.configure.simpleDecorator('autoinject', autoinject);
_index.Decorators.configure.parameterizedDecorator('inject', inject);
_index.Decorators.configure.parameterizedDecorator('registration', registration);
_index.Decorators.configure.parameterizedDecorator('transient', transient);
_index.Decorators.configure.parameterizedDecorator('singleton', singleton);
_index.Decorators.configure.parameterizedDecorator('instanceActivator', instanceActivator);
_index.Decorators.configure.parameterizedDecorator('factory', factory);