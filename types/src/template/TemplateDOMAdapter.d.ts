export default class TemplateDOMAdapter {
    constructor(parsed: any);
    ifQueryParts: any[];
    parsed: any;
    createElement(conf: any): any;
    addControlFlow(key: any, value: any, el: any, addChildren: any, addedChildren: any, setup: any): any[];
    bindIf(el: any, state: any, addChildren?: boolean, addedChildren?: boolean, setup?: () => void): any[];
    createText({ value }: {
        value: any;
    }): Text;
    createFromValue({ value }: {
        value: any;
    }): any;
    getEvaluatedElement(element: any): any[];
    removeElement(el: any): void;
    replaceElement(from: any, to: any): any[];
    appendElement(to: any, el: any): void;
    afterElement(to: any, el: any): any;
    beforeElement(to: any, el: any): void;
    /**
     * @param {boolean} inSVG
     * @return {any}
     */
    create(inSVG?: boolean): any;
    inSVG: boolean;
}
