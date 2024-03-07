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
    /** @param options */
    constructor(options?: {});
    /** @type {ShadowRoot|Node} */
    mainElement: ShadowRoot | Node;
    /** @type JDOMComponentOptions */
    options: JDOMComponentOptions;
    connectedCallback(): Promise<void>;
    registerAttributeListener(): void;
    /**
     * @param key
     * @param options
     */
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
export type JDOMComponentOptions = {
    shadowed: boolean;
    styles: string | null;
};
export type AttributeOptions = {
    name: string | null | undefined;
};
import JDOM from './JDOM.js';
