/**
 * Usage: html`<h1>Hello ${name}</h1>`
 *
 * @param strings
 * @param values
 * @return {JDOM}
 */
export function html(strings: any, ...values: any[]): JDOM;
/**
 * Usage: css`h1 {font-size: 20px}`
 *
 * @param strings
 * @param values
 * @return string
 */
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
 * @param strings
 * @param values
 * @return {Hook<string>}
 */
export function comp(strings: any, ...values: any[]): Hook<string>;
import Hook from '../Hook.js';
