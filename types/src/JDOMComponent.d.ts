export default class JDOMComponent extends HTMLElement {
    constructor(options?: {});
    /**
     * @type {ShadowRoot|Node}
     */
    mainElement: ShadowRoot | Node;
    options: {};
    connectedCallback(): Promise<void>;
    registerAttributeListener(): void;
    addAttributeListener(key: any, options?: {}): void;
    attributeListeners: any[] | undefined;
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
    #private;
}
import JDOM from './JDOM.js';
