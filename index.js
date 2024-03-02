import _JDOM from './src/JDOM.js'
import { html as _html, comp as _comp } from './src/template/template.js'
import * as hooks from './src/template/hooks.js'


/**
 * @param {HTMLElement|JDOM|NodeList|string} el
 * @param {Element|parent} parent
 * @return {_JDOM}
 */
export const $ = (el, parent = undefined) => new JDOM(el, parent)

/**
 * @param {HTMLTag|string} tag
 * @return {_JDOM}
 */
export const $n = _JDOM.new
export const $c = _JDOM.component
export const $r = _JDOM.registerComponent
export const $h = _JDOM.fromHTML
export const $escHTML = _JDOM.escapeHTML
export const JDOM = _JDOM
export const html = _html
export const comp = _comp

export const state = hooks.state
export const watch = hooks.watch
export const computed = hooks.computed
export const bind = hooks.bind

export default {
    $,
    $n,
    $c,
    $r,
    $h,
    JDOM,

    html,
    comp,

    watch,
    state,
    computed,
    bind
}
