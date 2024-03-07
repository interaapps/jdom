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
    /**
     * @param {T} val
     */
    setValue(val: T): void;
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
    /**
     * @param {function(val: T)} listener
     * @return {function(val: T)}
     */
    addListener(listener: any): (arg0: val) => T;
    /**
     * @param {function(val: T)} listener
     */
    removeListener(listener: any): void;
    toString(): string;
    #private;
}
