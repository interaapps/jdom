import JDOM from './JDOM.js'

export default class JDOMComponent extends HTMLElement {
    /**
     * @type {ShadowRoot|Node}
     */
    mainElement = null

    constructor(options = {}) {
        super()
        this.options = options
    }

    connectedCallback() {
        const { shadowed = true, style = null } = this.options

        this.mainElement = this
        if (shadowed) {
            this.mainElement = this.attachShadow({mode: 'closed'})
            const content = this.render()

            if (content) {
                new JDOM(this.mainElement).append(content)
            }
        }

        if (style) {
            this.addStyle(style)
        }

        let styleFromFunc = this.style()
        if (styleFromFunc)
            this.addStyle(styleFromFunc)
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
    style() {
        return undefined
    }
}