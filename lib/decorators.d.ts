export declare function autoinject(target?: any): void | ((target: any) => void);
export declare function inject(...rest: any[]): (target: any) => void;
export declare function registration(value: any, targetKey?: string): (target: any) => void;
export declare function transient(key?: any, targetKey?: string): (target: any) => void;
export declare function singleton(keyOrRegisterInChild?: any, registerInChild?: boolean, targetKey?: string): (target: any) => void;
export declare function instanceActivator(value: any, targetKey?: string): (target: any) => void;
export declare function factory(): (target: any) => void;
