import Hook from './Hook.js'

export default class TemplateStaticHTMLAdapter {
    constructor(parsed) {
        this.parsed = parsed
    }

    getValue(val) {
        return val instanceof Hook ? val.value : val
    }

    createElement(conf) {
        let el = '';

        if (conf.tag.toLowerCase() === '!doctype')
            return null

        el += `<${conf.tag}`

        Object.entries(conf.attributes).forEach(([key, value]) => {
            if (key.startsWith('@')) {
                key = `on${key.substring(1)}`
            } else if (key === ':if') {
                if (!this.getValue(value)) return null
            } else if (key === ':bind') {
                value = this.getValue(value)
            }

            el += ` ${this.escapeHtml(key)}="${this.escapeHtml(String(this.getValue(value)))}"`
        })

        el += '>'

        el += (new TemplateStaticHTMLAdapter(conf.body)).create()

        el += `</${conf.tag}>`

        return el
    }

    escapeHtml(unsafe) {
        return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
    }

    createText({value}) {
        return this.escapeHtml(value)
    }

    createFromValue({value}) {
        value = this.getValue(value)
        return value
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

    create() {
        let el = ''

        for (let element of this.parsed) {
            this.getEvaluatedElement(element).forEach(e => {
                if (Array.isArray(e)) {
                    e.forEach(ce => el += ce)
                } else {
                    el += e
                }
            })
        }

        return el
    }
}