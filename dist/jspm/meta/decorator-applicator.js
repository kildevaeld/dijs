"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(["require", "exports"], function (require, exports) {
    "use strict";

    var DecoratorApplicator = function () {
        function DecoratorApplicator() {
            _classCallCheck(this, DecoratorApplicator);

            this._first = null;
            this._second = null;
            this._third = null;
            this._rest = null;
        }

        _createClass(DecoratorApplicator, [{
            key: "decorator",
            value: function decorator(_decorator) {
                if (this._first === null) {
                    this._first = _decorator;
                    return this;
                }
                if (this._second === null) {
                    this._second = _decorator;
                    return this;
                }
                if (this._third === null) {
                    this._third = _decorator;
                    return this;
                }
                if (this._rest === null) {
                    this._rest = [];
                }
                this._rest.push(_decorator);
                return this;
            }
        }, {
            key: "_decorate",
            value: function _decorate(target) {
                var i, ii, rest;
                if (this._first !== null) {
                    this._first(target);
                }
                if (this._second !== null) {
                    this._second(target);
                }
                if (this._third !== null) {
                    this._third(target);
                }
                rest = this._rest;
                if (rest !== null) {
                    for (i = 0, ii = rest.length; i < ii; ++i) {
                        rest[i](target);
                    }
                }
            }
        }]);

        return DecoratorApplicator;
    }();

    exports.DecoratorApplicator = DecoratorApplicator;
});