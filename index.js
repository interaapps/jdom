import _JDOM from './src/JDOM.js'
import { html as _html, comp as _comp, css as _css } from './src/template/template.js'
import * as hooks from './src/hooks.js'
import _JDOMComponent from './src/JDOMComponent.js'
import _JDOMShadowComponent from './src/JDOMShadowComponent.js'
import _Hook from './src/Hook.js'

/**
 * @param {Node|JDOM|NodeList|string} el
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
export const css = _css
export const comp = _comp
export const JDOMComponent = _JDOMComponent
export const JDOMShadowComponent = _JDOMShadowComponent
export const Hook = _Hook

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
