"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DIError = function (_Error) {
    _inherits(DIError, _Error);

    function DIError(message) {
        _classCallCheck(this, DIError);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DIError).call(this, message));

        _this.message = message;
        return _this;
    }

    _createClass(DIError, [{
        key: "toString",
        value: function toString() {
            return "[" + this.name + ": " + this.message + "]";
        }
    }]);

    return DIError;
}(Error);

exports.DIError = DIError;

var DIAggregateError = function (_DIError) {
    _inherits(DIAggregateError, _DIError);

    function DIAggregateError(message, errors) {
        _classCallCheck(this, DIAggregateError);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DIAggregateError).call(this, message));

        _this2.errors = errors;
        return _this2;
    }
    /*toString (): string {
        return `[${this.name}: ${this.message}], errors:${this.errors}`
    }*/


    _createClass(DIAggregateError, [{
        key: "toString",
        value: function toString() {
            var errors = this.errors;
            var error = void 0;
            while (errors.length > 0) {
                error = errors[errors.length - 1];
                errors = error.errors || [];
            }
            if (error == null) {
                return "[" + this.name + ": " + this.message + "]";
            } else {
                return String.prototype.toString.call(error);
            }
        }
    }]);

    return DIAggregateError;
}(DIError);

exports.DIAggregateError = DIAggregateError;
function createError(name, message, errors) {
    var e = void 0;
    if (errors) {
        e = new DIAggregateError(message, errors);
    } else {
        e = new DIError(message);
    }
    e.name = name;
    return e;
}
exports.createError = createError;