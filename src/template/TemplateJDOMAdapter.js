import TemplateDOMAdapter from './TemplateDOMAdapter.js'
import JDOM from '../JDOM.js'

export default class TemplateJDOMAdapter extends TemplateDOMAdapter {
    create() {
        return new JDOM(super.create())
    }
}