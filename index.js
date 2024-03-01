import _JDOM from './JDOM.js'


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
export const JDOM = _JDOM

export default {
    $,
    $n,
    $c,
    $r,
    $h,
    JDOM
}
