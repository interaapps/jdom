/**
 * @template T
 * @param {T} initialValue
 * @return {Hook<T>}
 */
export function state<T>(initialValue: T): Hook<T>;
/**
 * If dependencies is not given, the dependencies will be automatically seletected
 *
 * @template T
 * @param {function(): T} callable
 * @param {Hook[]|undefined} dependencies
 * @return {Hook<T>}
 */
export function computed<T>(callable: () => T, dependencies?: Hook<any>[] | undefined): Hook<T>;
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
import JDOMComponent from './JDOMComponent.js';
