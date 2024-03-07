/**
 * @template T
 * @param {T} initialValue
 * @return {Hook}
 */
export function state<T>(initialValue: T): Hook<any>;
/**
 *
 * @param {function()} callable
 * @param {Hook[]} dependencies
 * @return {Hook}
 */
export function computed(callable: () => any, dependencies?: Hook<any>[]): Hook<any>;
/**
 * @param {Hook[]} hooks
 * @param {function()} callable
 */
export function watch(hooks: Hook<any>[], callable: () => any): void;
/**
 * @param {JDOMComponent} component
 * @param {string} attr
 * @return {Hook}
 */
export function bind(component: JDOMComponent, attr?: string): Hook<any>;
import Hook from './Hook.js';
