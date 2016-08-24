"use strict";

function __export(m) {
    for (var p in m) {
        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
}
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
exports.Version = '0.1.3';
__export(require('./container'));
__export(require('./meta/index'));
__export(require('./decorators'));
__export(require('./metadata'));