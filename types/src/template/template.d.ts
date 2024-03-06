/**
 * Usage: html`<h1>Hello ${name}</h1>`
 *
 * @param strings
 * @param values
 * @return {JDOM}
 */
export function html(strings: any, ...values: any[]): JDOM;
export function css(strings: any, ...values: any[]): string;
/**
 * usage:
 * ```js
 * const name = state('example')
 * const lastName = state('example')
 *
 * html`
 *      <h1>${comp`Hello ${name}, your last name is ${lastName} `}</h1>
 * `
 * ```
 *
 * @param {string[]} strings
 * @param {...any} values
 * @return {Hook}
 */
export function comp(strings: string[], ...values: any[]): Hook<any>;
import Hook from '../Hook.js';
