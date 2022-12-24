import _JDOM from './JDOM.js'

export const $ = el => new JDOM(el)
export const $n = el => JDOM.new(el)
export const JDOM = _JDOM

export default {
    $,
    $n,
    JDOM
}
