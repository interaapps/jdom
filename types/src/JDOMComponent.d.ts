export default class JDOMComponent extends HTMLElement {
    constructor(options?: {});
    /**
     * @type {ShadowRoot|Node}
     */
    mainElement: ShadowRoot | Node;
    options: {};
    connectedCallback(): void;
    registerAttributeListener(): void;
    addAttributeListener(key: any, options?: {}): void;
    attributeListeners: any[];
    /**
     * @param {string} style
     */
    addStyle(style: string): void;
    /**
     * @return {Node|JDOM|string|undefined}
     */
    render(): Node | JDOM | string | undefined;
    /**
     * @return {string|undefined}
     */
    styles(): string | undefined;
}
import JDOM from './JDOM.js';
