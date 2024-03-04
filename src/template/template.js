import JDOMTemplateParser from './JDOMTemplateParser.js'
import TemplateJDOMAdapter from './TemplateJDOMAdapter.js'
import { computed } from '../../index.js'
import Hook from './Hook.js'

/**
 * Usage: html`<h1>Hello ${name}</h1>`
 *
 * @param strings
 * @param values
 * @return {JDOM}
 */
export function html(strings, ...values) {
    // console.time("myFunction");
    const parser = JDOMTemplateParser.fromTemplate(strings, ...values)

    const parsed = parser.parse()

    const adapter = new TemplateJDOMAdapter(parsed)
    // console.timeEnd("myFunction");
    return adapter.create()
}

/**
 * usage:
 * ```js
 * const name = state('example')
 * const lastName = state('example')
 *
 * html`
 *      <h1>${comp`Hello ${name}, your last name is ${lastName} `}</h1>
 * `
 * ```
 *
 * @param {string[]} strings
 * @param {...any} values
 * @return {Hook}
 */
export function comp(strings, ...values) {
    return computed(() => {
        let out = ''

        let i = 0
        for (const str of strings) {
            out += str

            if (values[i]) {
                const value = values[i]
                if (value instanceof Hook) {
                    out += value.value
                }
            }
            i++
        }

        return out
    }, values.filter(v => v instanceof Hook))
}