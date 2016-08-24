'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _container = require('./container');

Object.keys(_container).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _container[key];
        }
    });
});

var _index = require('./meta/index');

Object.keys(_index).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _index[key];
        }
    });
});

var _decorators = require('./decorators');

Object.keys(_decorators).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _decorators[key];
        }
    });
});

var _metadata = require('./metadata');

Object.keys(_metadata).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _metadata[key];
        }
    });
});
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
var Version = exports.Version = '0.1.3';