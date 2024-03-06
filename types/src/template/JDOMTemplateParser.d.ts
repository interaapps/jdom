export default class JDOMTemplateParser {
    static fromTemplate(parts: any, ...values: any[]): JDOMTemplateParser;
    autoCloseTags: string[];
    index: number;
    elements: any[];
    get(index?: number): any;
    next(i?: number): void;
    hasNext(): boolean;
    parse(): ({
        attributes: {};
        from: number;
        tag: string;
        to: number;
        type: string;
        body: any[];
    } | {
        type: any;
        value: any;
    })[];
    isWhiteSpace(c: any): boolean;
    /**
     * @return {{attributes: {}, from: number, tag: string, to: number, type: string, body: *[]}|null}
     */
    readTag(): {
        attributes: {};
        from: number;
        tag: string;
        to: number;
        type: string;
        body: any[];
    } | null;
    isClosingTag(tag: any, ind?: number): boolean;
    readAttributes(): (string | boolean)[][];
    readAttribute(): {
        name: string;
        value: boolean;
        isLast: boolean;
        from: number;
        to: number;
    };
    readUntil(callable: any): {
        type: any;
        value: any;
    }[];
    shipComment(): boolean;
    readContent(ignoreTags?: boolean, tag?: boolean): ({
        attributes: {};
        from: number;
        tag: string;
        to: number;
        type: string;
        body: any[];
    } | {
        type: any;
        value: any;
    })[];
    skipEmpty(): void;
    nextIs(string: any, startInd?: number): boolean;
}
