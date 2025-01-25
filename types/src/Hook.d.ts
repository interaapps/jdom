/**
 * @template T
 * @property {T} value
 */
export default class Hook<T> {
    static TRACKING: any[];
    static IS_TRACKING: boolean;
    /**
     * @param {Hook} hook
     */
    static track(hook: Hook<any>): void;
    static enableTracking(): void;
    static disableTracking(): void;
    /**
     * @return {Hook[]}
     */
    static getTracked(): Hook<any>[];
    static clearTracked(): void;
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
    _value: T;
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
    /**
     * computed((val) => `Hello ${val}`)
     *
     * @param {(val: T) => any} fn
     * @return {Hook}
     */
    computed(fn: (val: T) => any): Hook<any>;
    /**
     * shorthand for computed
     *
     * @param {(val: T) => any} fn
     * @return {Hook}
     */
    $(fn: (val: T) => any): Hook<any>;
    #private;
}
