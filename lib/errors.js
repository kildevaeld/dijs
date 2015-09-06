"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createError = createError;

class DIError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
    toString() {
        return "[" + this.name + ": " + this.message + "]";
    }
}

exports.DIError = DIError;

class DIAggregateError extends DIError {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
    toString() {
        return "[" + this.name + ": " + this.message + "], errors:" + this.errors;
    }
}

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