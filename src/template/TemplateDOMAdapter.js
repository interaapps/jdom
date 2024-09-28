import Hook from '../Hook.js'
import JDOM from '../JDOM.js'
import { computed } from '../hooks.js'
import JDOMComponent from '../JDOMComponent.js'

export default class TemplateDOMAdapter {
    ifQueryParts = []

    constructor(parsed) {
        this.parsed = parsed
    }

    createElement(conf) {
        let el;
        let svg = false

        if (typeof conf.tag === 'string') {
            if (typeof conf.tag === 'string' && conf.tag.toLowerCase() === '!doctype')
                return null

            if (conf.tag === 'svg' || this.inSVG) {
                el = document.createElementNS('http://www.w3.org/2000/svg', conf.tag)
                svg = true
            } else if (conf.tag.includes('-') && window?.customElements) {
                const customElement = window.customElements.get(conf.tag)
                if (customElement) {
                    el = new customElement()
                }
            }
        } else if (conf.tag instanceof Node) {
            el = conf.tag
        } else if (conf.tag instanceof JDOM) {
            el = conf.tag.firstNode()
        } else if (typeof conf.tag === 'function') {
            if (conf.tag.prototype && conf.tag.prototype instanceof HTMLElement) {
                el = new conf.tag()
            } else {
                const elAttribs = {}

                if (conf.body.length > 0) {
                    elAttribs.$slot = (new TemplateDOMAdapter(conf.body)).create(svg)
                }

                for (const [key, value] of conf.attributes) {
                    if (key === ':bind') {
                        elAttribs.value = value
                    } else if (key === ':if' || key === ':else-if' || key === ':else') {
                    } else {
                        elAttribs[key] = value
                    }
                }

                let called = conf.tag(elAttribs)
                let newEl = this.createFromValue({ value: called })

                for (const [key, value] of conf.attributes) {
                    if (key === ':if' || key === ':else-if' || key === ':else') {
                        [newEl] = this.addControlFlow(key, value, newEl, false, false, () => null)
                    }
                }

                return newEl
            }
        }

        if (!el) {
            el = document.createElement(conf.tag)
        }

        let addChildren = true
        let addedChildren = false

        const attributes = []
        const events = {}
        let onCreate = () => {}
        let model = null

        const usingJDOMComponent = el instanceof JDOMComponent

        const setup = (elem = el) => {
            addedChildren = true
            for (const element of (new TemplateDOMAdapter(conf.body)).create(svg)) {
                this.appendElement(elem, element)
            }

            attributes.forEach(([key, value]) => {
                const setValue = (key, value) => {
                    if (key === 'style') {
                        if (typeof value === 'object') {
                            elem.style = ''
                            Object.entries(value).forEach(([key, value]) => {
                                if (value instanceof Hook) {
                                    const hook = value
                                    const listener = v => elem.style[key] = v
                                    elem.addEventListener(':detached', () => hook.removeListener(listener))
                                    elem.addEventListener(':attached', () => {
                                        hook.addListener(listener)
                                        listener(hook.value)
                                    })

                                    value = hook.value
                                }
                                elem.style[key] = value
                            })
                            return
                        }
                    }
                    if (key === 'class') {
                        if (typeof value !== 'string') {
                            let classes = []
                            if (Array.isArray(value)) {
                                classes = value
                            } else if (typeof value === 'object') {
                                Object.entries(value).forEach(([key, value]) => {
                                    if (value instanceof Hook) {
                                        const hook = value
                                        const listener = v => {
                                            console.log('Hok')
                                            if (v && !elem.classList.contains(key)) {
                                                elem.classList.add(key)
                                            } else if (!v && elem.classList.contains(key)) {
                                                elem.classList.remove(key)
                                            }
                                        }
                                        elem.addEventListener(':detached', () => {
                                            console.log('hok bom')
                                            hook.removeListener(listener)
                                        })
                                        elem.addEventListener(':attached', () => {
                                            hook.addListener(listener)
                                            listener(hook.value)
                                        })
                                        value = hook.value
                                    }
                                    if (value) {
                                        classes.push(key)
                                    }
                                })
                            }
                            [...elem.classList].filter(el => !classes.includes(el)).forEach(el => elem.classList.remove(el))
                            classes.filter(el => !elem.classList.contains(el)).forEach(el => elem.classList.add(el))
                            return
                        }
                    }

                    // JDOMComponent property reactivity
                    if (usingJDOMComponent) {
                        if (key.endsWith('.attr')) {
                            elem.setAttribute(key.replace('.attr', ''), value)
                        } else if (key.endsWith('.unhook')) {
                            elem[key] = value
                        } else if (elem[key] instanceof Hook && !(value instanceof Hook)) {
                            // Set the value of hook once
                            elem[key].value = value
                        } else {
                            // If both types are a hook, the inner element will be overwritten
                            elem[key] = value
                        }

                        return
                    }
                    console.log(key, value)
                    elem.setAttribute(key, value)
                }

                if (value instanceof Hook) {
                    const listener = value.addListener(() => {
                        setValue(key, value)
                    })
                    setValue(key, value)

                    elem.addEventListener(':detached', () => value.removeListener(listener))
                } else {
                    setValue(key, value)
                }
            })

            if (model) {
                if (usingJDOMComponent) {
                    elem.value = model
                    model.addListener(() => {
                        elem.dispatchEvent(new InputEvent('input:value'))
                    })
                } else {
                    elem.addEventListener('input', () => {
                        if (elem.value !== model.value) {
                            model.value = elem.value
                        }
                    })

                    model.addListener(val => {
                        if (elem.value !== model.value) {
                            elem.value = val
                            elem.dispatchEvent(new InputEvent('input:value'))
                        }
                    })

                    elem.value = model.value
                }
            }

            for (const [key, value] of Object.entries(events)) {
                const eventNameParts = key.split('.')
                const eventName = eventNameParts.shift()
                let handler = typeof value === 'function' ? value : () => {}

                if (eventNameParts.length > 0) {
                    const events = []
                    for (const part of eventNameParts) {
                        switch (part.toLowerCase()) {
                            case 'prevent':
                                events.push(e => e.preventDefault())
                                break
                            case 'stop':
                                events.push(e => e.stopPropagation())
                                break
                        }
                    }

                    const oldHandler = handler
                    handler = e => {
                        events.forEach(ev => ev(e))
                        oldHandler(e)
                    }
                }

                elem.addEventListener(eventName, handler)
            }
            onCreate(elem)
        }

        for (let [key, value] of conf.attributes) {
            if (typeof key === 'function') {
                key = key()
            }

            if (typeof key === 'object') {
                Object.entries(key).forEach(([key, value]) => attributes.push([key, value]))
                continue
            }

            if (key.startsWith('@')) {
                events[key.substring(1)] = value
            } else if (key.startsWith('!')) {
                attributes.push([key.substring(1), false])
            } else if(key === ':ref') {
                if (value instanceof Hook) {
                    value.value = el
                } else if (typeof value.value === 'function') {
                    value.value(el)
                } else {
                    console.error(':ref value is not a type of Hook or function.')
                }
            } else if(key === ':bind') {
                model = value
            } else if(key === ':html') {
                const getValue = () => value instanceof Hook ? value.value : value
                if (value instanceof Hook) {
                    value.addListener(() => {
                        el.innerHTML = getValue()
                    })
                }
                el.innerHTML = getValue()
            } else if(key === ':if' || key === ':else' || key === ':else-if') {
                [el, addChildren] = this.addControlFlow(key, value, el, addChildren, addedChildren, setup)
            } else if(key === '@:create') {
                onCreate = value
            } else {
                attributes.push([key, value])
            }
        }

        if (addChildren) {
            setup()
        }

        return el
    }


    addControlFlow(key, value, el, addChildren, addedChildren, setup) {
        let deps = null
        let destroy = () => null;
        if(key === ':if') {
            [el, addChildren, destroy] = this.bindIf(el, value, addChildren, addedChildren, setup)
            this.ifQueryParts.push(['IF', value, el, [value], destroy])
        } else if(key === ':else-if') {
            const [, , , deps] = this.ifQueryParts.pop();
            const comp = computed(() => {
                for (const dep of deps) {
                    if (dep.value)
                        return false
                }
                return value.value
            }, [value, ...deps])

            let destroy;
            ;[el, addChildren, destroy] = this.bindIf(el, comp, addChildren, addedChildren, setup)

            this.ifQueryParts.push(['ELSE-IF', comp, el, [...deps, comp], destroy])
        } else if(key === ':else') {
            const [type, state, _, deps] = this.ifQueryParts.pop();
            ;[el, addChildren] = this.bindIf(el, computed(() => {
                for (const dep of deps) {
                    if (dep.value)
                        return false
                }
                return true
            }, [state, ...deps]), addChildren, addedChildren, setup)
        }
        return [el, addChildren, destroy, deps]
    }

    bindIf(el, state, addChildren = true, addedChildren = false, setup = () => {}) {
        const savedElement = el
        const commentElement = document.createComment('JDOM-Templating:if')
        let lastValue = false
        const getValue = () => {
            lastValue = state instanceof Hook ? state.value : state
            return lastValue
        }

        if (getValue()) {
            el = savedElement
            addedChildren = true
        } else {
            el = commentElement
            addChildren = false
        }

        let toRepl = el
        let listener;
        if (state instanceof Hook) {
            listener = state.addListener(value => {
                if (lastValue === value) return
                lastValue = value

                if (value) {
                    if (!addedChildren) {
                        setup(savedElement)
                        addedChildren = true
                    }
                    toRepl = this.replaceElement(toRepl, savedElement)
                    el = savedElement
                } else {
                    toRepl = this.replaceElement(toRepl, commentElement)
                    el = commentElement
                }
            })
        }

        return [el, addChildren, () => listener ? state.removeListener(listener) : null]
    }

    createText({value}) {
        const el = document.createTextNode('')
        el.textContent = value
        return el
    }

    createFromValue({value}) {
        if (value instanceof Hook) {
            const state = value

            const isArray = Array.isArray(state.value)

            let outputElement = null

            let stateListener

            const hookListener = state.addListener(val => {
                if (!(isArray && Array.isArray(val) || !isArray && !Array.isArray(val))) {
                    if (outputElement) {
                        this.replaceElement(outputElement, this.createFromValue({value}))
                        value.removeListener(hookListener)

                        if (stateListener) {
                            state.removeListener(stateListener)
                        }
                    }
                }
            })

            if (isArray) {
                const comment = document.createComment('JDOM-Templating:arrhook1')
                outputElement = comment

                let elements = []

                const setElements = () => {
                    for (const item of elements) {
                        this.removeElement(item)
                    }

                    if (!Array.isArray(state.value)) {
                        this.replaceElement(outputElement, this.createFromValue({ value: state.value }))
                        state.removeListener(stateListener)
                        return
                    }

                    let lastEl = comment
                    let i = 0
                    for (const item of state.value) {
                        let itemEls = this.createFromValue({value: item})
                        if (!Array.isArray(itemEls))
                            itemEls = [itemEls]

                        const currentIndex = i++
                        elements = [...elements, ...itemEls]

                        itemEls.forEach((e) => {
                            lastEl = this.afterElement(lastEl, e)

                            const addReplaceListener = toRepl => {
                                toRepl.addEventListener(':replaced_with', ({detail: {to}}) => {
                                    for (const e of to) {
                                        addReplaceListener(e)
                                        elements.push(e)
                                    }
                                })

                                toRepl.addEventListener(':attached', () => {
                                    elements.push(toRepl)
                                })

                                toRepl.addEventListener(':detached', () => {
                                    elements = elements.filter(e => e !== toRepl)
                                })
                            }

                            addReplaceListener(lastEl)
                        })
                    }
                }

                stateListener = state.addListener(() => {
                    setElements()
                })

                setElements()

                return [comment, ...elements]
            } else if (typeof state.value === 'string' || typeof state.value === 'number' || typeof state.value === 'boolean') {
                outputElement = this.createText({value: state.value})

                const listener = state.addListener(() => {
                    if (typeof state.value === 'string' || typeof state.value === 'number' || typeof state.value === 'boolean') {
                        outputElement.textContent = state.value
                    } else {
                        this.replaceElement(outputElement, this.createFromValue({ value }))
                        state.removeListener(listener)
                    }
                })
                return outputElement
            } else {
                outputElement = this.createFromValue({value: state.value})

                stateListener = state.addListener(() => {
                    let element = this.createFromValue({value: state.value})

                    outputElement = this.replaceElement(outputElement, element)
                })
                return outputElement
            }
        } else if (value instanceof JDOM || value instanceof Node || value instanceof NodeList) {
            return (new JDOM(value)).nodes()
        } else if (Array.isArray(value)) {
            return value.map(e => this.createFromValue({value: e})).reduce((s, e) => Array.isArray(e) ? [...s, ...e] : [...s, e], [])
        } else if (value instanceof Promise) {
            let comment = document.createComment('JDOM-Templating:promise')

            value.then(el => {
                let elements = this.createFromValue({value: el})
                comment = this.replaceElement(comment, elements)
            })
            return comment
        } else if (Array.isArray(value)) {
            return value.map((e) => {
                let el = this.createFromValue({ value: e })

                return Array.isArray(el) ? el[0] ?? null : el
            })
        }
        return this.createText({ value })
    }

    getEvaluatedElement(element) {
        const elements = []
        if (element.type === 'text') {
            elements.push(this.createText(element))
        } else if (element.type === 'element') {
            elements.push(this.createElement(element))
        } else if (element.type === 'value') {
            let valElements = this.createFromValue(element)
            if (!Array.isArray(valElements))
                valElements = [valElements]

            for (let valElement of valElements) {
                elements.push(valElement)
            }
        }
        return elements
    }

    removeElement(el) {
        el.dispatchEvent(new CustomEvent(':detach'))
        el.remove()
        el.dispatchEvent(new CustomEvent(':detached'))
    }

    replaceElement(from, to) {
        const replElements = Array.isArray(from) ? [...from] : [from]
        const endElements = Array.isArray(to) ? [...to] : [to]
        const finalEndElements = [...endElements]

        if (endElements.length === 0)
            endElements.push(document.createComment('JDOM-Templating:REPLACEMENT'))

        const finalEnd = [...endElements]

        const firstEl = replElements.shift()
        const firstEndEl = endElements.shift()


        firstEl.dispatchEvent(new CustomEvent(':replace_with', { detail: { to: finalEndElements } }))
        firstEl.dispatchEvent(new CustomEvent(':detach'))
        firstEndEl.dispatchEvent(new CustomEvent(':child_attach'))
        firstEl.replaceWith(firstEndEl)

        replElements.forEach(e => this.removeElement(e))

        firstEl.dispatchEvent(new CustomEvent(':detached'))
        firstEndEl.dispatchEvent(new CustomEvent(':child_attached'))

        let lastEl = firstEndEl
        firstEndEl.dispatchEvent(new CustomEvent(':attach'))

        endElements.forEach(e => {
            lastEl = this.afterElement(lastEl, e)
        })
        firstEndEl.dispatchEvent(new CustomEvent(':attached'))

        firstEl.dispatchEvent(new CustomEvent(':replaced_with', { detail: { to: finalEndElements } }))

        return finalEnd
    }

    appendElement(to, el) {
        to.dispatchEvent(new CustomEvent(':child_attach'))
        el.dispatchEvent(new CustomEvent(':attach'))
        to.append(el)
        to.dispatchEvent(new CustomEvent(':child_attached'))
        el.dispatchEvent(new CustomEvent(':attached'))
    }

    afterElement(to, el) {
        to.dispatchEvent(new CustomEvent(':child_attach_after'))
        el.dispatchEvent(new CustomEvent(':attach'))
        to.after(el)
        to.dispatchEvent(new CustomEvent(':child_attached_after'))
        el.dispatchEvent(new CustomEvent(':attached'))
        return el
    }

    beforeElement(to, el) {
        to.dispatchEvent(new CustomEvent(':child_attach_before'))
        el.dispatchEvent(new CustomEvent(':attach'))
        to.before(el)
        to.dispatchEvent(new CustomEvent(':child_attached_before'))
        el.dispatchEvent(new CustomEvent(':attached'))
    }

    create(inSVG = false) {
        this.inSVG = inSVG
        const elements = []

        for (let element of this.parsed) {
            this.getEvaluatedElement(element).forEach(e => {
                if (Array.isArray(e)) {
                    e.forEach(ce => elements.push(ce))
                } else {
                    elements.push(e)
                }
            })
        }

        return elements.filter(e => e !== null && e !== undefined)
    }
}