export function $(el: Node | typeof _JDOM | NodeList | string, parent?: Element | Window): _JDOM;
/**
 * @param {HTMLTag|string} tag
 * @return {_JDOM}
 */
export const $n: typeof _JDOM.new;
export const $c: typeof _JDOM.component;
export const $r: typeof _JDOM.registerComponent;
export const $h: typeof _JDOM.fromHTML;
export const $escHTML: typeof _JDOM.escapeHTML;
export const JDOM: typeof _JDOM;
export const html: typeof _html;
export const css: typeof _css;
export const comp: typeof _comp;
export const JDOMComponent: typeof _JDOMComponent;
export const state: typeof hooks.state;
export const watch: typeof hooks.watch;
export const computed: typeof hooks.computed;
export const bind: typeof hooks.bind;
declare namespace _default {
    export { $ };
    export { $n };
    export { $c };
    export { $r };
    export { $h };
    export { JDOM };
    export { html };
    export { comp };
    export { watch };
    export { state };
    export { computed };
    export { bind };
}
export default _default;
import _JDOM from './src/JDOM.js';
import { html as _html } from './src/template/template.js';
import { css as _css } from './src/template/template.js';
import { comp as _comp } from './src/template/template.js';
import _JDOMComponent from './src/JDOMComponent.js';
import * as hooks from './src/hooks.js';
