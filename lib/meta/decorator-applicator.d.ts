export declare class DecoratorApplicator {
    _first: any;
    _second: any;
    _third: any;
    _rest: any;
    decorator(decorator: Function): DecoratorApplicator;
    _decorate(target: Function): void;
}
