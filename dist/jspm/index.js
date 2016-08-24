"use strict";

define(["require", "exports", './container', './meta/index', './decorators', './metadata'], function (require, exports, container_1, index_1, decorators_1, metadata_1) {
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
    __export(container_1);
    __export(index_1);
    __export(decorators_1);
    __export(metadata_1);
});