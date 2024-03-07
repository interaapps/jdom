import '../html-typedefs.js'
import Hook from './Hook.js'
import JDOMComponent from './JDOMComponent.js'
import {state} from './hooks.js'

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

class JDOM {
    /**
     * @param {Node|JDOM|NodeList|Array|string} element
     * @param {Node} parent
     */
    constructor(element, parent = undefined) {
        if (typeof parent === 'undefined')
            parent = document;

        /**
         * @type {Node[]}
         */
        this.elem = []

        this.hooks = {}

        if (element instanceof NodeList || Array.isArray(element)) {
            this.elem = [...element]
        } else if (element instanceof Node || element === document  || element === window) {
            this.elem = [element]
        } else if (element instanceof JDOM) {
            this.elem = element.elem
        } else {
            this.elem = [...parent.querySelectorAll(element)];
        }

        this.$ = selector => {
            if (typeof this.elem[0] !== 'undefined')
                return (new JDOM(selector, this.elem[0]));
            return null;
        }
    }

    /**
     * @param {function(JDOM)} callable
     * @return {JDOM}
     */
    each(callable) {
        for (const el of this.elem) {
            callable.call(el, new JDOM(el))
        }
        return this
    }

    /**
     * @param {function(JDOM)} callable
     * @return {JDOM}
     */
    forEach(callable) {
        return this.each(callable)
    }

    /**
    * @param {function(Node)} callable
    * @return {JDOM}
    */
    eachNodes(callable) {
        for (const el of this.elem) {
            callable.call(el, el)
        }
        return this
    }

    /**
     * @return {JDOM|null}
     */
    first() {
        return this.elem.length > 0 ? new JDOM(this.elem[0]) : null
    }

    /**
     * @return {JDOM[]}
     */
    elements() {
        return this.elem.map(e => new JDOM(e))
    }

    /**
     * @return {JDOM[]}
     */
    children() {
        return [...this.firstNode().childNodes].map(e => new JDOM(e))
    }

    /**
     * @return {Node|null}
     */
    firstNode() {
        return this.elem.length > 0 ? this.elem[0] : null
    }

    /**
     * @return {Node[]}
     */
    nodes() {
        return this.elem
    }

    /**
     * @param {string|Number|Hook} text
     * @return {JDOM}
     */
    setText(text) {
        return this.eachNodes(el => {
            if (text instanceof Hook) {
                this.hooks.text = [text, text.addListener(val => el.innerText = val)]
                el.textContent = text.value
                return
            } else if (this.hooks.text) {
                this.hooks.text[0].removeListener(this.hooks.text[1])
                this.hooks.text = undefined
            }

            el.innerText = text
        })
    }

    /**
     * @return {string|null}
     */
    getText() {
        const el = this.firstNode()
        return el ? el.innerText : null
    }

    /**
     * @param {string|Number|Hook|undefined} text
     * @return {string|null|JDOM}
     */
    text(text = undefined) {
        return text === undefined ? this.getText() : this.setText(text)
    }

    /**
     * @param {string|Hook} html
     * @return {JDOM}
     */
    setHTML(html) {
        return this.eachNodes(el => {
            if (html instanceof Hook) {
                this.hooks.html = [html, html.addListener(val => el.innerHTML = val)]
                el.innerHTML = html.value
                return
            } else if (this.hooks.html) {
                this.hooks.html[0].removeListener(this.hooks.html[1])
                this.hooks.html = undefined
            }

            el.innerHTML = html
        })
    }

    /**
     * @return {string|null}
     */
    getHTML() {
        const el = this.firstNode()
        return el ? el.innerHTML : null
    }

    /**
     * @param {string|Hook|undefined} html
     * @return {JDOM|string|null}
     */
    html(html = undefined) {
        if (html === undefined)
            return this.getHTML()
        else
            return this.setHTML(html)
    }

    /**
     *
     * @param {CSSPropertiesConfiguration} css
     * @return {JDOM}
     */
    css(css) {
        return this.eachNodes(el => {
            for (const [key, value] of Object.entries(css)) {
                el.style[key] = value
            }
        })
    }

    /**
     * @param {CSSPropertiesConfiguration} css
     * @return {JDOM}
     */
    style(css) {
        return this.css(css)
    }

    /**
     * @param {string} name
     * @return {HTMLAttributes}
     */
    getAttr(name) {
        const el = this.firstNode()
        return el ? el.getAttribute(name) : null
    }

    /**
     * @return {Object}
     */
    getAttributes() {
        const el = this.firstNode()
        const attribs = {}
        if (el) {
            const elAttributes = el.attributes
            for (const { nodeName, nodeValue } of elAttributes){
                attribs[nodeName] = nodeValue
            }
        }
        return attribs
    }

    /**
     * @param {HTMLAttributes} name
     * @param {string|Hook} val
     * @return {JDOM}
     */
    setAttr(name, val) {
        return this.eachNodes(el => {
            if (val instanceof Hook) {
                this.hooks[`attribute-${name}`] = [val, val.addListener(val => el.setAttribute(name, val))]
                el.setAttribute(name, val.value)
                return
            } else if (this.hooks[`attribute-${name}`]) {
                this.hooks[`attribute-${name}`][0].removeListener(this.hooks[`attribute-${name}`][1])
                this.hooks[`attribute-${name}`] = undefined
            }

            el.setAttribute(name, val)
        })
    }

    /**
     * @param {HTMLAttributes} name
     * @return {JDOM}
     */
    removeAttr(name) {
        return this.eachNodes(el => {
            el.removeAttribute(name)
        })
    }

    /**
     * @param {HTMLAttributes} name
     * @param {string|null|undefined} val
     * @return {JDOM|string|null}
     */
    attr(name, val = undefined) {
        if (typeof name === 'string')
            return val === undefined ? this.getAttr(name) : this.setAttr(name, val)

        for (const [key, val] of Object.entries(name)) {
            this.attr(key, val)
        }
        return this;
    }

    /**
     * @return {string[]}
     */
    attrs() {
        return this.getAttributes()
    }

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasClass(name) {
        const el = this.firstNode()
        return el ? el.classList.contains(name) : false
    }

    /**
     * @param {...string} names
     * @return {JDOM}
     */
    addClass(...names) {
        return this.eachNodes(el => {
            for (let name of names) {
                el.classList.add(name)
            }
        })
    }

    /**
     * @param {...string} names
     * @return {JDOM}
     */
    addClasses(...names) {
        return this.addClass(...names)
    }

    /**
     * @return {string[]}
     */
    getClasses() {
        const el = this.firstNode()
        return el ? [...el.classList] : []
    }

    /**
     * @param {...string} names
     * @return {JDOM}
     */
    classes(...names) {
        if (names.length === 0) {
            return this.getClasses()
        }
        return this.addClasses(...names)

    }

    /**
     * @param {string} name
     * @return {JDOM}
     */
    removeClass(name) {
        return this.eachNodes(el => {
            el.classList.remove(name)
        })
    }

    /**
     * @param {string} name
     * @return {JDOM}
     */
    toggleClass(name) {
        return this.eachNodes(el => {
            if (el.classList.contains(name)) {
                el.classList.remove(name)
            } else {
                el.classList.add(name)
            }
        })
    }

    /**
     * @return {any}
     */
    getValue() {
        const el = this.firstNode()
        return el ? el.value : null
    }

    /**
     * @param {any} val
     * @return {JDOM}
     */
    setValue(val) {
        return this.eachNodes(el => {
            el.value = val
        })
    }

    /**
     * @param {any} val
     * @return {JDOM}
     */
    val(value = undefined) {
        if (value === undefined) {
            return this.getValue()
        } else {
            return this.setValue(value)
        }
    }

    /**
     * @param {Hook} hook
     * @return {JDOM}
     */
    model(hook) {
        if (this.hooks.bind) {
            this.hooks.bind[0].removeListener(this.hooks.bind[1])
        }
        this.hooks.bind = [hook, hook.addListener(val => {
            this.val(val)
        })]

        this.val(hook.value)

        return this
    }

    /**
     * @param name
     * @param value
     * @return {*|null|JDOM}
     */
    setOrGetProperty(name, value = undefined) {
        if (value === undefined) {
            const el = this.firstNode()
            return el ? el[name] : null
        } else {
            return this.eachNodes(el => {
                el[name] = value
            })
        }
    }

    /**
     * @param {string} val
     * @return {*|JDOM|null}
     */
    id(val = undefined) {
        return this.setOrGetProperty('value', val)
    }

    /**
     * @param {...(string|JDOM|Node)} nodes
     * @return {JDOM}
     */
    append(...nodes) {
        let parent = this
        if (parent.firstNode() === document)
            parent = new JDOM(document.body)

        for (const node of nodes) {
            if (typeof node === 'string') {
                parent.eachNodes(el => {
                    if (el instanceof Element) {
                        el.insertAdjacentHTML('beforeend', node)
                    } else {
                        console.warn('Parent is not type of Element. Appending html might not work.')
                        const templ = document.createElement('template')
                        templ.innerHTML = node
                        el.appendChild(templ)
                    }
                })
            } else if (node instanceof JDOM) {
                parent.eachNodes(el => {
                    node.eachNodes(n => {
                        el.appendChild(n)
                    })
                })
            } else {
                parent.eachNodes(el => {
                    el.appendChild(node)
                })
            }
        }
        return this
    }

    /**
     * @param {...(string|JDOM|Node)} nodes
     * @return {JDOM}
     */
    appendTo(...nodes) {
        for (const node of nodes) {
            new JDOM(node).append(this)
        }

        return this
    }

    /**
     * @param {...(string|JDOM|Node)} nodes
     * @return {JDOM}
     */
    prepend(...nodes) {
        let parent = this
        if (parent.firstNode() === document)
            parent = new JDOM(document.body)

        for (const node of nodes) {
            if (typeof node === 'string') {
                parent.eachNodes(el => {
                    if (el instanceof Element) {
                        el.insertAdjacentHTML('beforebegin', node)
                    } else {
                        console.warn('Parent is not type of Element. Prepending html might not work.')
                        const templ = document.createElement('template')
                        templ.innerHTML = node
                        el.prepend(templ)
                    }
                })
            } else if (node instanceof JDOM) {
                parent.eachNodes(el => {
                    node.eachNodes(n => {
                        el.prepend(n)
                    })
                })
            } else {
                parent.eachNodes(el => {
                    el.prepend(node)
                })
            }
        }
        return this
    }

    /**
     * @param {Array<string|JDOM|Node>} nodes
     * @return {JDOM}
     */
    prependTo(...nodes) {
        for (const node of nodes) {
            new JDOM(node).prepend(this)
        }

        return this
    }

    /**
     * Is the element hidden by style.display === 'none'?
     * @return {boolean}
     */
    hidden() {
        const el = this.firstNode()
        return el ? el.style.display === 'none' : false
    }

    /**
     * @return {boolean}
     */
    shown() {
        return !this.hidden()
    }

    /**
     * @return {JDOM}
     */
    show() {
        return this.eachNodes(el => el.style.display = '')
    }

    /**
     * @return {JDOM}
     */
    hide() {
        return this.eachNodes(el => el.style.display = 'none')
    }

    /**
     * @return {JDOM}
     */
    toggle() {
        return this.eachNodes(el => {
            if (el.style.display === 'none') {
                el.style.display = ''
            } else {
                el.style.display = 'none'
            }
        })
    }

    /**
     * @param {Hook} hook
     * @return {JDOM}
     */
    showIf(hook) {
        this.hooks.showIf = [hook, hook.addListener(val => val ? this.show() : this.hide())]

        if (hook.value) {
            this.show()
        } else {
            this.hide()
        }

        return this
    }

    /**
     *
     * @param {CSSPropertiesConfiguration} css CSS-Styles
     * @param {Number} duration
     * @return {Promise<JDOM>}
     */
    animate(css={}, duration = 1000) {
        return new Promise(r => {
            this.css({
                transition: `${duration}ms`
            })
            this.css(css)

            setTimeout(function() {
                r(this)
            }, duration);
        })
    }

    /**
     * @param {Animation[]} animations
     * @return {Promise<JDOM>}
     */
    async animator(animations) {
        for (const animation of animations) {
            await this.animate(animation.css, animation.duration || 1000)
        }
        return this;
    }

    /**
     * @param {EventListenerType} listener
     * @param {function(Event)} callable
     * @return {JDOM}
     */
    on(listener, callable) {
        this.eachNodes(el => {
            for (const listenerSplit of listener.split('|')) {
                el.addEventListener(listenerSplit, callable)
            }
        })
        return this
    }

    /**
     * @param {EventListenerType} listener
     * @param {function(Event)} callable
     * @return {JDOM}
     */
    removeEvent(listener, callable) {
        this.eachNodes(el => {
            el.removeEvent(listener, callable)
        })
        return this
    }

    /**
     * @param {Object} events
     * @return {JDOM}
     */
    bind(events = {}) {
        for (const [listener, callable] of Object.entries(events)) {
            this.on(listener, callable)
        }
        return this
    }

    /**
     * @param {function(PointerEvent)|undefined} callable
     * @return {JDOM}
     */
    click(callable = undefined) {
        if (callable === undefined) {
            return this.eachNodes(el => {
                el.click()
            })
        }
        return this.on('click', callable)
    }


    /**
     * @param {function(FocusEvent)|undefined} callable
     * @return {JDOM}
     */
    focus(func) {
        if (callable === undefined) {
            return this.eachNodes(el => {
                el.focus()
            })
        }
        return this.on('focus', func);
    }

    /**
     * @param {number} index
     * @return {JDOM}
     */
    get(index) {
        return new JDOM(this.elem[index])
    }

    /**
     * @return {number}
     */
    size() {
        return this.elem.length
    }

    /**
     * @return {Element[]}
     */
    toArray() {
        return [...this.elem]
    }

    /** @param {function(PointerEvent)} func @return {JDOM} */
    contextmenu(func) { return this.on('contextmenu', func); }
    /** @param {function(Event)} func @return {JDOM} */
    change(func) { return this.on('change', func); }
    /** @param {function(MouseEvent)} func @return {JDOM} */
    mouseover(func) { return this.on('mouseover', func); }
    /** @param {function(KeyboardEvent)} func @return {JDOM} */
    keypress(func) { return this.on('keypress', func); }
    /** @param {function(KeyboardEvent)} func @return {JDOM} */
    keyup(func) { return this.on('keyup', func); }
    /** @param {function(KeyboardEvent)} func @return {JDOM} */
    keydown(func) { return this.on('keydown', func); }
    /** @param {function(MouseEvent)} func @return {JDOM} */
    dblclick(func) { return this.on('dblclick', func); }
    /** @param {function(Event)} func @return {JDOM} */
    resize(func) { return this.on('resize', func); }
    /** @param {function(Event)} func @return {JDOM} */
    timeupdate(func) { return this.on('timeupdate', func); }
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchcancel(func) { return this.on('touchcancel', func); }
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchend(func) { return this.on('touchend', func); }
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchmove(func) { return this.on('touchmove', func); }
    /** @param {function(TouchEvent)} func @return {JDOM} */
    touchstart(func) { return this.on('touchstart', func); }
    /** @param {function(DragEvent)} func @return {JDOM} */
    drag(func) { return this.on('drag', func); }
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragenter(func) { return this.on('dragenter', func); }
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragleave(func) { return this.on('dragleave', func); }
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragover(func) { return this.on('dragover', func); }
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragend(func) { return this.on('dragend', func); }
    /** @param {function(DragEvent)} func @return {JDOM} */
    dragstart(func) { return this.on('dragstart', func); }
    /** @param {function(DragEvent)} func @return {JDOM} */
    drop(func) { return this.on('drop', func); }
    /** @param {function(FocusEvent)} func @return {JDOM} */
    focusout(func) { return this.on('focusout', func); }
    /** @param {function(FocusEvent)} func @return {JDOM} */
    focusin(func) { return this.on('focusin', func); }
    /** @param {function(Event)} func @return {JDOM} */
    invalid(func) { return this.on('invalid', func); }
    /** @param {function(Event)} func @return {JDOM} */
    popstate(func) { return this.on('popstate', func); }
    /** @param {function(Event)} func @return {JDOM} */
    volumechange(func) { return this.on('volumechange', func); }
    /** @param {function(Event)} func @return {JDOM} */
    unload(func) { return this.on('unload', func); }
    /** @param {function(Event)} func @return {JDOM} */
    offline(func) { return this.on('offline', func); }
    /** @param {function(Event)} func @return {JDOM} */
    online(func) { return this.on('online', func); }


    /**
     * @return {JDOM}
     */
    remove() {
        return this.eachNodes(el => el.remove())
    }

    /**
     * @param {function(Event)} func
     * @return {JDOM}
     */
    ready(func) {
        this.on('DOMContentLoaded', func);
        return this;
    }

    [Symbol.iterator]() {
        return this.elem
    }

    /**
     * @param {HTMLTag} tag
     * @param constructorArgs
     * @return {JDOM}
     */
    static new(tag = 'div', ...constructorArgs) {
        // Custom Elements Standard requires dash
        if (tag.includes('-') && window?.customElements) {
            const customElement = window.customElements.get(tag)
            if (customElement) {
                return new JDOM(new customElement(...constructorArgs))
            }
        }


        return new JDOM(document.createElement(tag))
    }

    /**
     * A helper to create custom elements
     *
     * @param {function(JDOM, JDOMComponent)} component
     * @param {Object} options
     * @return {JDOMComponent}
     */
    static component(component, options = {}) {
        return class extends JDOMComponent {

            #value = null

            constructor() {
                super(options)
                this.#value = state(this.value)
            }

            connectedCallback() {
                super.connectedCallback()

                const $el = new JDOM(this.mainElement)

                ;(async () => {
                    const res = await component.call(this, $el, this)
                    if (res) {
                        $el.append(res)
                    }
                })();
            }

            set value(val) {
                if (val instanceof Hook)
                    this.#value = val
                else
                    this.#value.value = val
                this.dispatchEvent(new CustomEvent('input:value'))
            }

            get value() {
                return this.#value?.value
            }
        }
    }

    /**
     * @param {string|Event} event
     * @param {any} options
     * @return {JDOM}
     */
    dispatch(event, options = {}) {
        this.eachNodes(el => el.dispatchEvent(typeof event === 'string' ? new CustomEvent(event, options) : event))
        return this
    }

    /**
     * Registers a webcomponent
     *
     * @param {string|Object.<string, Node|HTMLElement|JDOMComponent>} tag
     * @param {Node|HTMLElement|JDOMComponent|undefined} component
     */
    static registerComponent(tag, component = undefined) {
        if (typeof  tag === 'string') {
            window.customElements.define(tag, component)
            return component
        }
        Object.entries(tag).forEach(([name, comp]) => {
            window.customElements.define(name, comp)
        })
    }

    /**
     * When the document is ready, the callback will be called
     *
     * @param {function(Event)} callback
     */
    static ready(callback) {
        (new JDOM(document)).ready(callback)
    }

    /**
     * HTML-Escapes the given text to prevent XSS.
     *
     * @param {string} text
     * @return string
     */
    static escapeHTML(text) {
        const textEl = document.createElement('jdom-internal-text-element')
        textEl.innerText = text
        return textEl.innerHTML
    }

    /**
     * @param {string} html
     * @return {JDOM}
     */
    static fromHTML(html) {
        const template = JDOM.new('div').html(html || '')
        const children = template?.first()

        const el = children.length === 0 ? null :
            children.length === 1 ? children[0] :
                children

        template.remove()

        return el
    }
}

export default JDOM