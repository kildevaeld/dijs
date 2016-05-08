"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createError = createError;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DIError = (function (_Error) {
    _inherits(DIError, _Error);

    function DIError(message) {
        _classCallCheck(this, DIError);

        _Error.call(this, message);
        this.message = message;
    }

    DIError.prototype.toString = function toString() {
        return "[" + this.name + ": " + this.message + "]";
    };

    return DIError;
})(Error);

exports.DIError = DIError;

var DIAggregateError = (function (_DIError) {
    _inherits(DIAggregateError, _DIError);

    function DIAggregateError(message, errors) {
        _classCallCheck(this, DIAggregateError);

        _DIError.call(this, message);
        this.errors = errors;
    }

    /*toString (): string {
        return `[${this.name}: ${this.message}], errors:${this.errors}`
    }*/

    DIAggregateError.prototype.toString = function toString() {
        var errors = this.errors;
        var error = undefined;
        while (errors.length > 0) {
            error = errors[errors.length - 1];
            errors = error.errors || [];
        }
        if (error == null) {
            return "[" + this.name + ": " + this.message + "]";
        } else {
            return String.prototype.toString.call(error);
        }
    };

    return DIAggregateError;
})(DIError);

exports.DIAggregateError = DIAggregateError;

function createError(name, message, errors) {
    var e = undefined;
    if (errors) {
        e = new DIAggregateError(message, errors);
    } else {
        e = new DIError(message);
    }
    e.name = name;
    return e;
}