'use strict';

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