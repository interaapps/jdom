import JDOM from './JDOM.js'
import Hook from './Hook.js'

/**
 * @typedef JDOMComponentOptions
 * @property {boolean} shadowed
 * @property {string|null} styles
 */

/**
 * @typedef AttributeOptions
 * @property {String|null|undefined} name
 */


export default class JDOMComponent extends HTMLElement {
    /** @type {ShadowRoot|Node} */
    mainElement = null

    /** @type {boolean} */
    #jdomConnectedAlready = false

    /** @type JDOMComponentOptions */
    options

    /** @param options */
    constructor(options = {}) {
        super()
        this.options = options

        this.registerAttributeListener()
    }

    async connectedCallback() {
        if (this.#jdomConnectedAlready)
            return;

        this.#jdomConnectedAlready = true

        const { shadowed = true, style = null } = this.options
        this.registerAttributeListener()

        this.mainElement = this

        if (shadowed) {
            this.mainElement = this.attachShadow({mode: 'closed'})
        }

        const content = await this.render() // It may be async
        if (content) {
            new JDOM(this.mainElement).append(content)
        }

        if (style) {
            this.addStyle(style)
        }

        let styleFromFunc = this.styles()
        if (styleFromFunc)
            this.addStyle(styleFromFunc)


        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes') {
                    this.dispatchEvent(new CustomEvent(':attributechanged', {detail: {mutation}}))
                }
            })
        }).observe(this, {
            attributes: true
        })
    }

    registerAttributeListener() {
        if (this.attributeListeners) {
            for (let attributeListener of this.attributeListeners) {
                const {key, options: {name = null}} = attributeListener
                const attrName = name || key

                if (this[key] instanceof Hook) {
                    this[key].value = this.getAttribute(attrName)
                } else {
                    this[key] = this.getAttribute(attrName)
                }

                let lastListener = null
                this.addEventListener(':attributechanged', e => {
                    const { detail: { mutation } } = e

                    if (!lastListener) {
                        lastListener = this[key].addListener(val => {
                            this.setAttribute(attrName, val)
                        })
                    }

                    if (mutation.attributeName === attrName) {
                        const attrVal = this.getAttribute(attrName)
                        if (this[key] instanceof Hook) {
                            if (this[key].value !== attrVal) {
                                this[key].value = attrVal
                            }
                        } else {
                            this[key] = attrVal
                        }
                    }
                })
            }
        }
    }

    /**
     * @param key
     * @param options
     */
    addAttributeListener(key, options = {}) {
        if (!this.attributeListeners)
            this.attributeListeners = []
        this.attributeListeners.push({ key, options })
    }

    /**
     * @param {string} style
     */
    addStyle(style) {
        const styleEl = document.createElement('style')
        styleEl.textContent = style
        this.mainElement.appendChild(styleEl)
    }

    /**
     * @return {Node|JDOM|string|undefined}
     */
    render() {}

    /**
     * @return {string|undefined}
     */
    styles() {
        return undefined
    }
}