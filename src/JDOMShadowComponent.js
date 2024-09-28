import JDOMComponent from './JDOMComponent.js'

/**
 * @extends {JDOMComponent|HTMLElement}
 */
export default class JDOMShadowComponent extends JDOMComponent {
    constructor(options = {}) {
        super({
            shadowed: true,
            ...options,
        })
    }
}