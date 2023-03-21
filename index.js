import _JDOM from './JDOM.js'

export const $ = el => new JDOM(el)
export const $n = el => JDOM.new(el)
export const $c = (tag, comp) => JDOM.component(tag, comp)
export const $r = (tag, comp) => JDOM.registerComponent(tag, comp)
export const $h = html => JDOM.fromHTML(html)
export const JDOM = _JDOM

export default {
    $,
    $n,
    $c,
    $r,
    $h,
    JDOM
}
