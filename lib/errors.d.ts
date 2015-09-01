export declare class DIError implements Error {
    name: string;
    message: string;
    constructor(message: string);
    toString(): string;
}
export declare class DIAggregateError extends DIError {
    errors: Error[];
    constructor(message: string, errors: Error[]);
    toString(): string;
}
export declare function createError(name: string, message: string, errors?: Error[]): Error;
