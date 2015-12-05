export interface MetadataType {
    global: Object;
    noop: Function;
    resource: string;
    paramTypes: string;
    properties: string;
}
/**
* Provides helpers for working with metadata.
*
* @class Metadata
* @static
*/
export declare var Metadata: {
    global: any;
    noop: () => void;
    paramTypes: string;
    properties: string;
    get(metadataKey: string, target: Function, targetKey?: string): Object;
    getOwn(metadataKey: string, target: Function, targetKey?: string): Object;
    define(metadataKey: string, metadataValue: Object, target: Function, targetKey?: string): void;
    getOrCreateOwn(metadataKey: string, Type: FunctionConstructor, target: Function, targetKey: string): Object;
};
