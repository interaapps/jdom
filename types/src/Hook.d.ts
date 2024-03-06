/**
 * @template T
 * @property {T} value
 */
export default class Hook<T> {
    /**
     * @param {T} value
     */
    constructor(value: T);
    listeners: any[];
    deleteListeners: any[];
    setValue(val: any): void;
    _value: any;
    /**
     * @param {T} val
     */
    set value(val: T);
    /**
     * @return {T}
     */
    get value(): T;
    destroy(): void;
    dispatchListener(oldVal: any): void;
    addListener(listener: any): any;
    removeListener(listener: any): void;
    toString(): string;
    #private;
}
