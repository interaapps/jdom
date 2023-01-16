/*
    JDOM IS A SIMPLE DOM SELECTOR WITH FUNCTIONS!
    This is not finished! If you want to add something, just do it!
*/


class JDOM {
    constructor(element, parent = undefined) {
        if (typeof parent === 'undefined')
            parent = document;

        this.elem = []

        if (element instanceof NodeList) {
            this.elem = element
        } else if (element instanceof HTMLElement || element === document  || element === window) {
            this.elem = [element]
        } else if (element instanceof JDOM) {
            this.elem = element.elem
        } else {
            this.elem = parent.querySelectorAll(element);
        }

        this.$ = selector => {
            if (typeof this.elem[0] !== 'undefined')
                return (new JDOM(selector, this.elem[0]));
            return null;
        }
    }

    each(callable) {
        for (const el of this.elem) {
            callable.call(el, el)
        }
        return this
    }

    first() {
        return this.elem.length > 0 ? this.elem[0] : null
    }

    setText(text) {
        return this.each(el => {
            el.innerText = text
        })
    }

    getText() {
        const el = this.first()
        return el ? el.innerText : null
    }

    text(text = null) {
        return text === null ? this.getText() : this.setText(text)
    }

    setHTML(html) {
        return this.each(el => {
            el.innerHTML = html
        })
    }

    getHTML() {
        const el = this.first()
        return el ? el.innerHTML : null
    }

    html(html = null) {
        if (html === null)
            return this.getHTML()
        else
            return this.setHTML(html)
    }

    css(css) {
        return this.each(el => {
            for (const [key, value] of Object.entries(css)) {
                el.style[key] = value
            }
        })
    }

    style(css) {
        return this.css(css)
    }


    getAttr(name) {
        const el = this.first()
        return el ? el.innerHTML : null
    }

    setAttr(name, val) {
        return this.each(el => {
            el.setAttribute(name, val)
        })
    }

    removeAttr(name) {
        return this.each(el => {
            el.removeAttribute(name)
        })
    }

    attr(name, val = undefined) {
        if (typeof name === 'string')
            return val === undefined ? this.getAttr(name) : this.setAttr(name, val)

        for (const [key, val] of Object.entries(name)) {
            this.attr(key, val)
        }
        return this;
    }

    hasClass(name) {
        const el = this.first()
        return el ? el.classList.contains(name) : false
    }

    addClass(name) {
        return this.each(el => {
            el.classList.add(name)
        })
    }

    removeClass(name) {
        return this.each(el => {
            el.classList.remove(name)
        })
    }

    toggleClass(name) {
        return this.each(el => {
            if (el.classList.contains(name)) {
                el.classList.remove(name)
            } else {
                el.classList.add(name)
            }
        })
    }

    getValue() {
        const el = this.first()
        return el ? el.value : null
    }

    setValue(val) {
        return this.each(el => {
            el.value = val
        })
    }

    val(value = undefined) {
        if (value === undefined) {
            return this.getValue()
        } else {
            return this.setValue(value)
        }
    }

    setOrGetProperty(name, value = undefined) {
        if (value === undefined) {
            const el = this.first()
            return el ? el[name] : null
        } else {
            return this.each(el => {
                el[name] = value
            })
        }
    }

    id(val = undefined) {
        return this.setOrGetProperty('value', val)
    }

    append(node) {
        if (typeof node === 'string') {
            return this.each(el => {
                el.insertAdjacentHTML('beforeend', node)
            })
        } else if (node instanceof JDOM) {
            return this.each(el => {
                el.appendChild(node.first())
            })
        } else {
            return this.each(el => {
                el.appendChild(node)
            })
        }
    }

    prepend(node) {
        if (typeof node === 'string') {
            return this.each(el => {
                el.insertAdjacentHTML('beforebegin', node)
            })
        } else if (node instanceof JDOM) {
            return this.each(el => {
                el.prepend(node.first())
            })
        } else {
            return this.each(el => {
                el.prepend(node)
            })
        }
    }

    hidden() {
        const el = this.first()
        return el ? el.style.display === 'none' : false
    }

    shown() {
        return !this.hidden()
    }

    show() {
        return this.each(el => el.style.display = '')
    }

    hide() {
        return this.each(el => el.style.display = 'none')
    }

    toggle() {
        return this.each(el => {
            if (el.style.display === 'none') {
                el.style.display = ''
            } else {
                el.style.display = 'none'
            }
        })
    }

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

    async animator(animations) {
        for (const animation of animations) {
            await this.animate(animation.css, animation.duration || 1000)
        }
        return this;
    }

    /*
       EVENTS
    * */
    on(listener, callable) {
        this.each(el => {
            for (const listenerSplit of listener.split('|')) {
                el.addEventListener(listenerSplit, callable)
            }
        })
        return this
    }

    removeEvent(listener, callable) {
        this.each(el => {
            el.removeEvent(listener, callable)
        })
        return this
    }

    bind(events = {}) {
        for (const [listener, callable] of Object.entries(events)) {
            this.on(listener, callable)
        }
        return this
    }

    click(callable = null) {
        if (callable === null) {
            return this.each(el => {
                el.click()
            })
        }
        return this.on('click', callable)
    }

    contextmenu(func) { return this.on('contextmenu', func); }
    change(func) { return this.on('change', func); }
    mouseover(func) { return this.on('mouseover', func); }
    keypress(func) { return this.on('keypress', func); }
    keyup(func) { return this.on('keyup', func); }
    keydown(func) { return this.on('keydown', func); }
    dblclick(func) { return this.on('dblclick', func); }
    resize(func) { return this.on('resize', func); }

    timeupdate(func) { return this.on('timeupdate', func); }
    touchcancle(func) { return this.on('touchcancle', func); }
    touchend(func) { return this.on('touchend', func); }
    touchmove(func) { return this.on('touchmove', func); }
    touchstart(func) { return this.on('touchstart', func); }
    drag(func) { return this.on('drag', func); }
    dragenter(func) { return this.on('dragenter', func); }
    dragleave(func) { return this.on('dragleave', func); }
    dragover(func) { return this.on('dragover', func); }
    dragend(func) { return this.on('dragend', func); }
    dragstart(func) { return this.on('dragstart', func); }
    drop(func) { return this.on('drop', func); }
    focus(func) { return this.on('focus', func); }
    focusout(func) { return this.on('focusout', func); }
    focusin(func) { return this.on('focusin', func); }
    invalid(func) { return this.on('invalid', func); }
    popstate(func) { return this.on('popstate', func); }
    volumechange(func) { return this.on('volumechange', func); }
    unload(func) { return this.on('unload', func); }
    offline(func) { return this.on('offline', func); }
    online(func) { return this.on('online', func); }
    focus(func) { return this.on('focus', func); }

    remove() {
        return this.each(el => el.remove())
    }

    ready(func) {
        this.on('DOMContentLoaded', func);
        return this;
    }

    static new(tag = 'div') {
        return new JDOM(document.createElement(tag))
    }
}

export default JDOM