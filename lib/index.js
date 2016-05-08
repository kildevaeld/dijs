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
var Version = '0.1.3';
exports.Version = Version;

var _container = require('./container');

_defaults(exports, _interopExportWildcard(_container, _defaults));

var _metaIndex = require('./meta/index');

_defaults(exports, _interopExportWildcard(_metaIndex, _defaults));

var _decorators = require('./decorators');

_defaults(exports, _interopExportWildcard(_decorators, _defaults));

var _metadata = require('./metadata');

_defaults(exports, _interopExportWildcard(_metadata, _defaults));