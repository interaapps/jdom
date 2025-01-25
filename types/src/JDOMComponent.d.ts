/**
 * @typedef JDOMComponentOptions
 * @property {boolean} [shadowed]
 * @property {string|null} [styles]
 */
/**
 * @typedef AttributeOptions
 * @property {String|null|undefined} name
 */
/**
 * @extends {HTMLElement}
 */
export default class JDOMComponent extends HTMLElement {
    /**
     * @type {typeof JDOMComponent}
     */
    static unshadowed: typeof JDOMComponent;
    /** @param {JDOMComponentOptions} options */
    constructor(options?: JDOMComponentOptions);
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
    attributeListeners: any[];
    setup(): void;
    detach(): void;
    detached(): void;
    attach(): void;
    attached(): void;
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
    /**
     * @param {Event} event
     */
    dispatchEvent(event: Event): void;
    #private;
}
export type JDOMComponentOptions = {
    shadowed?: boolean;
    styles?: string | null;
};
export type AttributeOptions = {
    name: string | null | undefined;
};
import JDOM from './JDOM.js';
