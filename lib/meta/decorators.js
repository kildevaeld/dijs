'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Decorators = undefined;

var _decoratorApplicator = require('./decorator-applicator');

var Decorators = exports.Decorators = {
    configure: {
        parameterizedDecorator: function parameterizedDecorator(name, decorator) {
            Decorators[name] = function () {
                var applicator = new _decoratorApplicator.DecoratorApplicator();
                return applicator[name].apply(applicator, arguments);
            };
            _decoratorApplicator.DecoratorApplicator.prototype[name] = function () {
                var result = decorator.apply(null, arguments);
                return this.decorator(result);
            };
        },
        simpleDecorator: function simpleDecorator(name, decorator) {
            Decorators[name] = function () {
                return new _decoratorApplicator.DecoratorApplicator().decorator(decorator);
            };
            _decoratorApplicator.DecoratorApplicator.prototype[name] = function () {
                return this.decorator(decorator);
            };
        }
    }
};