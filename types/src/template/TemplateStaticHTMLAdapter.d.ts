export default class TemplateStaticHTMLAdapter {
    constructor(parsed: any);
    parsed: any;
    getValue(val: any): any;
    createElement(conf: any): string;
    escapeHtml(unsafe: any): any;
    createText({ value }: {
        value: any;
    }): any;
    createFromValue({ value }: {
        value: any;
    }): any;
    getEvaluatedElement(element: any): any[];
    create(): string;
}
