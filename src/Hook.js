/**
 * @template T
 * @property {T} value
 */
export default class Hook {
    listeners = []
    deleteListeners = []

    #destroyed = false
    #alreadyProxied = false

    static TRACKING = []
    static IS_TRACKING = false


    /**
     * @param {T} value
     */
    constructor(value) {
        this.setValue(value)

        return new Proxy(this, {
            get: (target, prop)  => {
                if (Object.hasOwn(target, prop) || prop in target || prop === 'value') {
                    return Reflect.get(target, prop);
                }
                if (typeof target._value === 'object' && !Array.isArray(target._value) && target._value !== null) {
                    const newHook = new Hook(target._value[prop])
                    newHook.listeners.push(val => {
                        if (val !== target._value[prop]) {
                            target._value[prop] = val
                            this.setValue(target.value)
                        }
                    })
                    this.listeners.push(val => {
                        if (val !== val[prop]) {
                            newHook.value = val[prop]
                        }
                    })
                    return newHook
                }

                return Reflect.get(target, prop);
            },
            set: (target, prop, value) => {
                if (Object.hasOwn(target, prop) || prop in target || prop === 'value') {
                    if (target[prop] === value)
                        return true;

                    return Reflect.set(target, prop, value);
                }
                if (typeof target._value === 'object' && !Array.isArray(target._value) && target._value !== null) {
                    if (target._value[prop] === value)
                        return true;

                    return Reflect.set(target._value, prop, value);
                }
                return Reflect.set(target, prop, value);
            }
        });
    }

    /**
     * @param {T} val
     */
    setValue(val) {
        const old = this._value
        this._value = val
        this.dispatchListener(old)
    }

    #createObserver(val) {
        return new Proxy(val, {
            set: (target, prop, value) => {
                if (val === val[prop])
                    return true;

                val[prop] = value
                this.setValue(val)

                return Reflect.set(val, prop, value);
            }
        });
    }


    /**
     * @param {T} val
     */
    set value(val) {
        if (this.#destroyed) {
            return undefined
        }
        this.setValue(val)
    }

    /**
     * @return {T}
     */
    get value() {
        Hook.track(this)
        return this._value
    }

    destroy() {
        this.#destroyed = true
        this.listeners = []
    }

    dispatchListener(oldVal) {
        for (let listener of this.listeners) {
            try {
                if (listener.call(this, this._value, oldVal) === true)
                    break
            } catch (e) {}
        }
    }

    /**
     * @param {function(val: T)} listener
     * @return {function(val: T)}
     */
    addListener(listener) {
        this.listeners.push(listener)
        return listener
    }

    /**
     * @param {function(val: T)} listener
     */
    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener)
    }

    toString() {
        return `${this.value}`
    }

    /**
     * @param {Hook} hook
     */
    static track(hook) {
        if (Hook.IS_TRACKING) {
            Hook.TRACKING.push(hook)
        }
    }

    static enableTracking() {
        Hook.IS_TRACKING = true
    }
    static disableTracking() {
        Hook.IS_TRACKING = false
        Hook.clearTracked()
    }

    /**
     * @return {Hook[]}
     */
    static getTracked() {
        return Hook.TRACKING
    }

    static clearTracked() {
        Hook.TRACKING = []
    }
}