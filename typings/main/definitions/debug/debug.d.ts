// Compiled using typings@0.6.7
// Source: https://raw.githubusercontent.com/typings/typed-ms/f40c81c7f45bc35e970de851117c29fc959220b2/index.d.ts
declare module 'debug~ms/index' {
function ms (value: string): number;
function ms (value: number, options?: ms.Options): string;

module ms {
  export interface Options {
    long: boolean;
  }
}

export = ms;
}
declare module 'debug~ms' {
import main = require('debug~ms/index');
export = main;
}

// Compiled using typings@0.6.7
// Source: https://raw.githubusercontent.com/typings/typed-debug/0a12b05a76400107c70a266dcd4c2b656baa7dae/node.d.ts
declare module 'debug/node' {
import ms = require('debug~ms');

function debug (namespace: string): debug.Debugger;

module debug {
  export interface Debugger {
    (message: any, ...args: any[]): void;
    enabled: boolean;
    namespace: string;
  }

  export function coerce (value: any): any;
  export function disable (): void;
  export function enable (namespaces: string): void;
  export function enabled (namespace: string): boolean;
  export var humanize: typeof ms;

  // Node implementation exports.
  export var log: Function;
  export function formatArgs (...args: any[]): any;
  export function save (namespaces?: string): void;
  export function load (): string | void;
  export function useColors (): boolean;
  export var colors: number[];
}

export = debug;
}
declare module 'debug' {
import main = require('debug/node');
export = main;
}