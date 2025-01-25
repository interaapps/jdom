import TemplateDOMAdapter from './TemplateDOMAdapter.js'
import JDOM from '../JDOM.js'

export default class TemplateJDOMAdapter extends TemplateDOMAdapter {
    /**
     * @param {boolean} inSVG
     * @return {*}
     */
    create(inSVG = false) {
        return new JDOM(super.create())
    }
}