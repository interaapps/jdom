import JDOM from './src/JDOM.js'
export { default as JDOM } from './src/JDOM.js'
export { html, comp, css } from './src/template/template.js'
export * from './src/hooks.js'
export * from './src/decorators.js'
export { default as JDOMComponent } from './src/JDOMComponent.js'
export { default as JDOMShadowComponent } from './src/JDOMShadowComponent.js'
export { default as Hook } from './src/Hook.js'

/**
 * @param {Node|JDOM|NodeList|string} el
 * @param {Element|parent} parent
 * @return {JDOM}
 */
export const $ = (el, parent = undefined) => new JDOM(el, parent)

export const $n = JDOM.new
export const $c = JDOM.component
export const $r = JDOM.registerComponent
export const $h = JDOM.fromHTML
export const $escHTML = JDOM.escapeHTML
