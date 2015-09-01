export interface DecoratorsConfigType {
    parameterizedDecorator(name: string, decorator: Function): void;
    simpleDecorator(name: string, decorator: Function): void;
}
export interface DecoratorsType {
    configure: DecoratorsConfigType;
}
export declare let Decorators: DecoratorsType;
