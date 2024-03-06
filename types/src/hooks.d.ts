export function state(initialValue: any): Hook<any>;
export function computed(callable: any, dependencies?: any[]): Hook<any>;
export function watch(hooks: any, callable: any): void;
export function bind(component: any, attr?: string): Hook<any>;
import Hook from './Hook.js';
