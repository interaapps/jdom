import Hook from './Hook.js'
import JDOM from '../JDOM.js'

export default class TemplateDOMAdapter {
    constructor(parsed) {
        this.parsed = parsed
    }

    createElement(conf) {
        let el;
        let svg = false

        if (typeof conf.tag === 'function') {
            const elAttribs = {}
            for (const [key, value] of conf.attributes) {
                if (key === ':bind') {
                    elAttribs.value = value
                } else {
                    elAttribs[key] = value
                }
            }

            const newEl = conf.tag(elAttribs)

            return this.createFromValue({value: newEl})
        }
        if (conf.tag.toLowerCase() === '!doctype')
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

        if (!el) {
            el = document.createElement(conf.tag)
        }

        let addChildren = true
        let addedChildren = false

        const attributes = []
        const events = {}
        let onCreate = () => {}
        let model = null

        const setup = (elem = el) => {
            addedChildren = true
            for (const element of (new TemplateDOMAdapter(conf.body)).create(svg)) {
                elem.append(element)
            }

            attributes.forEach(([key, value]) => {
                const setValue = (key, value) => {
                    if (key === 'style') {
                        if (typeof value === 'object') {
                            elem.style = ''
                            Object.entries(value).forEach(([key, value]) => {
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
                    elem.setAttribute(key, value)
                }

                if (value instanceof Hook) {
                    value.listeners.push(() => {
                        setValue(key, value.value)
                    })
                    setValue(key, value.value)
                } else {
                    setValue(key, value)
                }
            })

            if (model) {
                elem.addEventListener('input', () => {
                    if (elem.value !== model.value) {
                        model.value = elem.value
                    }
                })

                model.listeners.push(val => {
                    if (elem.value !== model.value) {
                        elem.value = val
                        elem.dispatchEvent(new InputEvent('input:value'))
                    }
                })

                elem.value = model.value
            }

            Object.entries(events).forEach(([key, value]) => elem.addEventListener(key, value))
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
            } else if(key === ':bind') {
                model = value
            } else if(key === ':if') {
                const savedElement = el
                const commentElement = document.createComment('JDOM IS AMAIZING')
                let lastValue = false
                const getValue = () => {
                    lastValue = value instanceof Hook ? value.value : value
                    return lastValue
                }

                if (getValue()) {
                    el = savedElement
                } else {
                    el = commentElement
                    addChildren = false
                }

                value.listeners.push(value => {
                    if (lastValue === value) return;
                    lastValue = value

                    if (value) {
                        el.replaceWith(savedElement)
                        el = savedElement
                        if (!addedChildren) setup(el)
                    } else {
                        el.replaceWith(commentElement)
                        el = commentElement
                    }
                })

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

    createText({value}) {
        const el = document.createTextNode('')
        el.textContent = value
        return el
    }

    createFromValue({value}) {
        if (value instanceof Hook) {
            const state = value

            const isArray = Array.isArray(state.value)

            let removeEl = () => {}
            const listeners = []
            let outputElement = null

            const l = value.addListener(val => {
                if (!(isArray && Array.isArray(val) || !isArray && !Array.isArray(val))) {
                    if (outputElement) {
                        let elements = this.createFromValue({value})
                        if (!Array.isArray(elements)) {
                            elements = [elements]
                        }

                        if (elements.length > 0) {
                            const newElements = []
                            removeEl = () => {
                                newElements.forEach(e => (e.$remove || e.remove)())
                            }
                            const firstEl = elements.shift()
                            outputElement.replaceWith(firstEl)
                            for (const item of elements) {
                                firstEl.before(item)
                                newElements.push(item)
                            }
                        } else {
                            value.removeListener(l)
                            listeners.forEach(li => value.removeListener(i))
                            removeEl()
                        }
                    }
                }
            })

            if (isArray) {
                const comment = document.createComment('JDOM IS AMAIZING')
                outputElement = comment

                let elements = []

                removeEl = () => elements.forEach(e => e.forEach(i => i.remove()))
                const setElements = (prepend = true) => {
                    for (const item of elements) {
                        item.elements.forEach(e => e.remove())
                        elements = elements.filter(e => e !== item)
                    }
                    let i = 0
                    for (const item of state.value) {
                        let itemEls = this.createFromValue({value: item})
                        if (!Array.isArray(itemEls))
                            itemEls = [itemEls]

                        elements.push({
                            key: ++i,
                            elements: itemEls
                        })

                        if (prepend)
                            itemEls.forEach(e => comment.before(e))
                    }
                }

                state.listeners.push(() => {
                    setElements()
                })

                setElements(false)

                const out = []
                for (const item of elements) {
                    item.elements.forEach(e => out.push(e))
                }
                return [...out, comment]
            } else if (typeof state.value === 'string' || typeof state.value === 'number' || typeof state.value === 'boolean') {
                outputElement = this.createText({value: state.value})

                state.listeners.push(() => {
                    outputElement.textContent = state.value
                })
                return outputElement
            } else {
                outputElement = this.createFromValue({value: state.value})
                state.listeners.push(() => {
                    let element = this.createFromValue({value: state.value})

                    if (Array.isArray(element))
                        [element] = element

                    outputElement.replaceWith(element)
                    outputElement = element
                })
                return outputElement
            }
        } else if (value instanceof JDOM || value instanceof Node || value instanceof NodeList) {
            return (new JDOM(value)).nodes()
        } else if (value instanceof Promise) {
            const comment = document.createComment('JDOM IS AMAIZING')
            value.then(el => {
                let elements = this.createFromValue({value: el})
                if (!Array.isArray(elements))
                    elements = [elements]

                if (elements.length > 0) {
                    const firstEl = elements.shift()
                    comment.replaceWith(firstEl)
                    for (const item of elements) {
                        firstEl.before(item)
                    }
                }
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