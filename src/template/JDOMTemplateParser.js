export default class JDOMTemplateParser {
    autoCloseTags = ['hr', 'br', 'input', 'img', 'meta', 'link', 'wbr', 'source', 'keygen', 'spacer', 'isindex', 'track', 'param', 'embed', 'base', 'area', 'col', '!doctype']

    constructor() {
        this.index = 0
        this.elements = []
    }

    static fromTemplate(parts, ...values) {
        const parser = new JDOMTemplateParser()

        let valuesIndex = 0
        for (const part of parts) {
            for (const item of part.split('')) {
                parser.elements.push({
                    type: 'char',
                    value: item
                })
            }
            if (valuesIndex < values.length) {
                parser.elements.push({
                    type: 'value',
                    value: values[valuesIndex]
                })
                valuesIndex++
            }
        }
        return parser
    }

    get(index = this.index) {
        return this.elements[index]
    }

    next(i = 1) {
        this.index += i
    }

    hasNext() {
        return this.elements.length > this.index
    }

    parse() {
        const contents = this.readContent()
        this.index = 0
        return contents
    }

    isWhiteSpace(c) {
        return c === '\n' || c === ' '
    }

    /**
     * @return {{attributes: {}, from: number, tag: string, to: number, type: string, body: *[]}}
     */
    readTag() {
        let tag = { type: 'element', tag: '', attributes: [], body: [], from: this.index, to: 0 }
        let opened = ''
        let tagNameOpened = true
        let closingTag = false
        while (this.hasNext()) {
            const {type, value} = this.get()

            if (!opened) {
                if (tagNameOpened) {
                    if (this.isWhiteSpace(value)) {
                        tag.attributes = this.readAttributes()

                        if (this.get().value === '>') {
                            tagNameOpened = false
                            continue
                        }

                        if (this.nextIs('/>')) {
                            this.next(2)
                            break
                        }
                    } else if (value === '>') {
                        tagNameOpened = false
                        continue
                    } else if (type === 'value') {
                        tag.tag = value
                    } else if (value !== '<') {
                        tag.tag += value
                    }
                }


                if (value === '>') {
                    if (this.autoCloseTags.includes(tag.tag.toLowerCase())) {
                        this.next()
                        break
                    }
                    opened = true
                }
            } else if (closingTag) {
                const next = `</${tag.tag}`

                // TODO: Check why -1 is needed
                if (this.nextIs(next, -1)) {
                    this.next(next.length - 1)
                    this.skipEmpty()
                    // Skipping >
                    this.next()

                    break
                }
            } else {
                tag.body = this.readContent()
                closingTag = true
            }

            this.next()
        }

        tag.to = this.index
        return tag
    }

    readAttributes() {
        const attributes = []
        let inAttribute = false

        while (this.hasNext()) {
            this.skipEmpty()
            const {type, value} = this.get()

            if (value === '>' || value === '/') {
                break;
            } else {
                const {name, value: attrValue} = this.readAttribute()
                attributes.push([name, attrValue])

                if (this.get().value === '>' || (this.get().value === '/' && this.get(this.index + 1)?.value === '>')) {
                    break;
                }
            }

            this.next()
        }
        return attributes
    }

    readAttribute() {
        const out = {name: '', value: true, isLast: false, from: this.index, to: 0}

        let hasReadName = false
        let hasReadEquals = false
        let foundValue = false

        while (this.hasNext()) {
            this.skipEmpty()
            const {type, value} = this.get()

            if (value === '>')
                break

            if (!hasReadName) {
                let doBreak = false

                if (type === 'value') {
                    out.name = value
                    hasReadName = true
                    continue
                }

                let [{value: name}] = this.readUntil(({type, value}) => {
                    if (value === '>') {
                        doBreak = true
                        out.isLast = true
                        return true
                    }
                    if (value === '=' || this.isWhiteSpace(value)) {
                        if (value === '=')
                            return true

                        let i = this.index
                        while (this.get(i) && this.isWhiteSpace(this.get(i).value)) {
                            i++
                        }
                        if (this.get(i).value !== '=') {
                            doBreak = true
                            return true
                        }
                    }
                })

                if (name === '>') break

                if (!out.name)
                    out.name = name
                if (doBreak) break
                hasReadName = true
                continue
            } else if (!hasReadEquals) {
                if (value !== '=' || value === '>') {
                    break
                }
                hasReadEquals = true
            } else {
                if (type === 'value') {
                    out.value = value
                    this.next()
                    break
                } else if (!foundValue) {
                    let opened = false
                    let val = ''
                    let opener = ''
                    let i = 0
                    let [{value}] = this.readUntil(({type, value}) => {
                        let doNotAdd = false

                        if (i++ === 0 && (value === '"' || value === "'"))
                            opener = value

                        if (value === opener) {
                            if (opened) {
                                return true
                            }
                            opened = true
                        }
                        if (!doNotAdd)
                            val += value
                    })
                    out.value = value.substring(1)
                    break
                }
            }

            this.next()
        }

        out.to = this.index
        return out
    }

    readUntil(callable) {
        let out = []
        let currentStr = ''
        while (this.hasNext()) {
            const { type, value } = this.get()

            if (callable({ type, value })) {
                if (currentStr !== '')
                    out.push({type: 'text', value: currentStr})
                break
            }

            if (type === 'char') {
                currentStr += value
            } else {
                if (currentStr !== '') {
                    out.push({type: 'text', value: currentStr})
                    currentStr = ''
                }
                out.push({ type, value })
            }

            this.next()
        }
        return out
    }

    shipComment() {
        if (this.nextIs('<!--')) {
            while (this.hasNext()) {
                if (this.nextIs('-->')) {
                    this.next(3)
                    break;
                }
                this.next()
            }
            return true
        }
        return false
    }

    readContent() {
        const contents = []
        let currentString = ''
        this.skipEmpty()
        while (this.hasNext()) {
            const { type, value } = this.get()

            if (type === 'char') {
                if (value === '<') {

                    if (currentString !== '') {
                        contents.push({type: 'text', value: currentString})
                        currentString = ''
                    }

                    if (this.get(this.index+1)?.value === '/') {
                        break
                    }

                    if (this.shipComment()) continue

                    contents.push(this.readTag())
                    this.skipEmpty()
                    continue
                }

                currentString += value
            } else {
                if (currentString !== '') {
                    contents.push({type: 'text', value: currentString})
                    currentString = ''
                }
                contents.push({type, value})
                this.next()
                continue
            }

            this.next()
        }

        if (currentString !== '') {
            contents.push({type: 'text', value: currentString})
        }

        return contents
    }

    skipEmpty() {
        while (this.hasNext() && (this.isWhiteSpace(this.get().value))) {
            this.next()
        }
    }

    nextIs(string, startInd = 0) {
        const split = string.split('')

        for (let ind in split) {
            // idk why but JS makes the indexes to a string...
            ind = parseInt(ind)
            const current = this.get(this.index + ind + startInd)

            if (current === undefined) return false
            const {type, value} = current

            if (value !== split[ind])
                return false
        }

        return true
    }
}