export default JDOM;
export type Animation = {
    css: CSSPropertiesConfiguration;
    duration: number;
};
export type JDOMCustomHTMLElement = any;
/**
 * @typedef Animation
 * @property {CSSPropertiesConfiguration} css
 * @property {Number} duration
 */
/**
 * @typedef JDOMCustomHTMLElement
 * @extends HTMLElement
 * @property {function(style: string)} addStyle
 * @property {any} #value
 * @property {...any} args
 * @property {Node} el
 */
declare class JDOM {
    /**
     * @param {HTMLTag} tag
     * @param constructorArgs
     * @return {JDOM}
     */
    static "new"(tag?: HTMLTag, ...constructorArgs: any[]): JDOM;
    /**
     * A helper to create custom elements
     *
     * @param {function(JDOM, JDOMComponent)} component
     * @param {Object} options
     * @return {JDOMComponent}
     */
    static component(component: (arg0: JDOM, arg1: JDOMComponent) => any, options?: any): JDOMComponent;
    /**
     * Registers a webcomponent
     *
     * @param {string|Object.<string, Node|HTMLElement|JDOMCustomHTMLElement>} tag
     * @param {Node|HTMLElement|JDOMCustomHTMLElement|undefined} component
     */
    static registerComponent(tag: string | {
        [x: string]: Node | HTMLElement | JDOMCustomHTMLElement;
    }, component?: Node | HTMLElement | JDOMCustomHTMLElement | undefined): any;
    /**
     * When the document is ready, the callback will be called
     *
     * @param {function(Event)} callback
     */
    static ready(callback: (arg0: Event) => any): void;
    /**
     * HTML-Escapes the given text to prevent XSS.
     *
     * @param {string} text
     * @return string
     */
    static escapeHTML(text: string): string;
    /**
     * @param {string} html
     * @return {JDOM}
     */
    static fromHTML(html: string): JDOM;
    /**
     * @param {Node|JDOM|NodeList|string} element
     * @param {Node} parent
     */
    constructor(element: Node | JDOM | NodeList | string, parent?: Node);
    /**
     * @type {Node[]}
     */
    elem: Node[];
    hooks: {};
    $: (selector: any) => JDOM;
    /**
     * @param {function(JDOM)} callable
     * @return {JDOM}
     */
    each(callable: (arg0: JDOM) => any): JDOM;
    /**
     * @param {function(JDOM)} callable
     * @return {JDOM}
     */
    forEach(callable: (arg0: JDOM) => any): JDOM;
    /**
    * @param {function(Node)} callable
    * @return {JDOM}
    */
    eachNodes(callable: (arg0: Node) => any): JDOM;
    /**
     * @return {JDOM|null}
     */
    first(): JDOM | null;
    /**
     * @return {JDOM[]}
     */
    elements(): JDOM[];
    /**
     * @return {JDOM[]}
     */
    children(): JDOM[];
    /**
     * @return {Node|null}
     */
    firstNode(): Node | null;
    /**
     * @return {Node[]}
     */
    nodes(): Node[];
    /**
     * @param {string|Number|Hook} text
     * @return {JDOM}
     */
    setText(text: string | number | Hook<any>): JDOM;
    /**
     * @return {string|null}
     */
    getText(): string | null;
    /**
     * @param {string|Number|Hook|undefined} text
     * @return {string|null|JDOM}
     */
    text(text?: string | number | Hook<any> | undefined): string | null | JDOM;
    /**
     * @param {string|Hook} html
     * @return {JDOM}
     */
    setHTML(html: string | Hook<any>): JDOM;
    /**
     * @return {string|null}
     */
    getHTML(): string | null;
    /**
     * @param {string|Hook|undefined} html
     * @return {JDOM|string|null}
     */
    html(html?: string | Hook<any> | undefined): JDOM | string | null;
    /**
     *
     * @param {CSSPropertiesConfiguration} css
     * @return {JDOM}
     */
    css(css: CSSPropertiesConfiguration): JDOM;
    /**
     * @param {CSSPropertiesConfiguration} css
     * @return {JDOM}
     */
    style(css: CSSPropertiesConfiguration): JDOM;
    /**
     * @param {string} name
     * @return {HTMLAttributes}
     */
    getAttr(name: string): HTMLAttributes;
    /**
     * @return {Object}
     */
    getAttributes(): any;
    /**
     * @param {HTMLAttributes} name
     * @param {string|Hook} val
     * @return {JDOM}
     */
    setAttr(name: HTMLAttributes, val: string | Hook<any>): JDOM;
    /**
     * @param {HTMLAttributes} name
     * @return {JDOM}
     */
    removeAttr(name: HTMLAttributes): JDOM;
    /**
     * @param {HTMLAttributes} name
     * @param {string|null|undefined} val
     * @return {JDOM|string|null}
     */
    attr(name: HTMLAttributes, val?: string | null | undefined): JDOM | string | null;
    /**
     * @return {string[]}
     */
    attrs(): string[];
    /**
     * @param {string} name
     * @return {boolean}
     */
    hasClass(name: string): boolean;
    /**
     * @param {...string} names
     * @return {JDOM}
     */
    addClass(...names: string[]): JDOM;
    /**
     * @param {...string} names
     * @return {JDOM}
     */
    addClasses(...names: string[]): JDOM;
    /**
     * @return {string[]}
     */
    getClasses(): string[];
    /**
     * @param {...string} names
     * @return {JDOM}
     */
    classes(...names: string[]): JDOM;
    /**
     * @param {string} name
     * @return {JDOM}
     */
    removeClass(name: string): JDOM;
    /**
     * @param {string} name
     * @return {JDOM}
     */
    toggleClass(name: string): JDOM;
    /**
     * @return {any}
     */
    getValue(): any;
    /**
     * @param {any} val
     * @return {JDOM}
     */
    setValue(val: any): JDOM;
    /**
     * @param {any} val
     * @return {JDOM}
     */
    val(value?: any): JDOM;
    /**
     * @param {Hook} hook
     * @return {JDOM}
     */
    model(hook: Hook<any>): JDOM;
    /**
     * @param name
     * @param value
     * @return {*|null|JDOM}
     */
    setOrGetProperty(name: any, value?: any): any | null | JDOM;
    /**
     * @param {string} val
     * @return {*|JDOM|null}
     */
    id(val?: string): any | JDOM | null;
    /**
     * @param {...(string|JDOM|Node)} nodes
     * @return {JDOM}
     */
    append(...nodes: (string | JDOM | Node)[]): JDOM;
    /**
     * @param {...(string|JDOM|Node)} nodes
     * @return {JDOM}
     */
    appendTo(...nodes: (string | JDOM | Node)[]): JDOM;
    /**
     * @param {...(string|JDOM|Node)} nodes
     * @return {JDOM}
     */
    prepend(...nodes: (string | JDOM | Node)[]): JDOM;
    /**
     * @param {Array<string|JDOM|Node>} nodes
     * @return {JDOM}
     */
    prependTo(...nodes: Array<string | JDOM | Node>): JDOM;
    /**
     * Is the element hidden by style.display === 'none'?
     * @return {boolean}
     */
    hidden(): boolean;
    /**
     * @return {boolean}
     */
    shown(): boolean;
    /**
     * @return {JDOM}
     */
    show(): JDOM;
    /**
     * @return {JDOM}
     */
    hide(): JDOM;
    /**
     * @return {JDOM}
     */
    toggle(): JDOM;
    /**
     * @param {Hook} hook
     * @return {JDOM}
     */
    showIf(hook: Hook<any>): JDOM;
    /**
     *
     * @param {CSSPropertiesConfiguration} css CSS-Styles
     * @param {Number} duration
     * @return {Promise<JDOM>}
     */
    animate(css?: CSSPropertiesConfiguration, duration?: number): Promise<JDOM>;
    /**
     * @param {Animation[]} animations
     * @return {Promise<JDOM>}
     */
    animator(animations: Animation[]): Promise<JDOM>;
    /**
     * @param {EventListenerType} listener
     * @param {function(Event)} callable
     * @return {JDOM}
     */
    on(listener: EventListenerType, callable: (arg0: Event) => any): JDOM;
    /**
     * @param {EventListenerType} listener
     * @param {function(Event)} callable
     * @return {JDOM}
     */
    removeEvent(listener: EventListenerType, callable: (arg0: Event) => any): JDOM;
    /**
     * @param {Object} events
     * @return {JDOM}
     */
    bind(events?: any): JDOM;
    /**
     * @param {function(PointerEvent)|undefined} callable
     * @return {JDOM}
     */
    click(callable?: ((arg0: PointerEvent) => any) | undefined): JDOM;
    /**
     * @param {function(FocusEvent)|undefined} callable
     * @return {JDOM}
     */
    focus(func: any): JDOM;
    /**
     * @param {number} index
     * @return {JDOM}
     */
    get(index: number): JDOM;
    /**
     * @return {number}
     */
    size(): number;
    /**
     * @return {Element[]}
     */
    toArray(): Element[];
    /** @param {function(PointerEvent)} func @return {JDOM} */
    contextmenu(func: (arg0: PointerEvent) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    change(func: (arg0: Event) => any): JDOM;
    /** @param {function(MouseEvent)} func @return {JDOM} */
    mouseover(func: (arg0: MouseEvent) => any): JDOM;
    /** @param {function(KeyboardEvent)} func @return {JDOM} */
    keypress(func: (arg0: KeyboardEvent) => any): JDOM;
    /** @param {function(KeyboardEvent)} func @return {JDOM} */
    keyup(func: (arg0: KeyboardEvent) => any): JDOM;
    /** @param {function(KeyboardEvent)} func @return {JDOM} */
    keydown(func: (arg0: KeyboardEvent) => any): JDOM;
    /** @param {function(MouseEvent)} func @return {JDOM} */
    dblclick(func: (arg0: MouseEvent) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    resize(func: (arg0: Event) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    timeupdate(func: (arg0: Event) => any): JDOM;
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchcancel(func: (arg0: TouchEvent) => any): JDOM;
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchend(func: (arg0: TouchEvent) => any): JDOM;
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchmove(func: (arg0: TouchEvent) => any): JDOM;
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchstart(func: (arg0: TouchEvent) => any): JDOM;
    /** @param {function(DragEvent)} func @return {JDOM} */
    drag(func: (arg0: DragEvent) => any): JDOM;
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragenter(func: (arg0: DragEvent) => any): JDOM;
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragleave(func: (arg0: DragEvent) => any): JDOM;
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragover(func: (arg0: DragEvent) => any): JDOM;
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragend(func: (arg0: DragEvent) => any): JDOM;
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragstart(func: (arg0: DragEvent) => any): JDOM;
    /** @param {function(DragEvent)} func @return {JDOM} */
    drop(func: (arg0: DragEvent) => any): JDOM;
    /** @param {function(FocusEvent)} func @return {JDOM} */
    focusout(func: (arg0: FocusEvent) => any): JDOM;
    /** @param {function(FocusEvent)} func @return {JDOM} */
    focusin(func: (arg0: FocusEvent) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    invalid(func: (arg0: Event) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    popstate(func: (arg0: Event) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    volumechange(func: (arg0: Event) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    unload(func: (arg0: Event) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    offline(func: (arg0: Event) => any): JDOM;
    /** @param {function(Event)} func @return {JDOM} */
    online(func: (arg0: Event) => any): JDOM;
    /**
     * @return {JDOM}
     */
    remove(): JDOM;
    /**
     * @param {function(Event)} func
     * @return {JDOM}
     */
    ready(func: (arg0: Event) => any): JDOM;
    /**
     * @param {string|Event} event
     * @param {any} options
     * @return {JDOM}
     */
    dispatch(event: string | Event, options?: any): JDOM;
    [Symbol.iterator](): Node[];
}
import Hook from './Hook.js';
import JDOMComponent from './JDOMComponent.js';
