import { state as _state, computed as _computed, watch as _watch, bind as _bind } from './hooks.js'
import Hook from "./Hook.js";

export function State() {
    return function (target: any, key: string) {
        const value = _state(target[key]?.value);

        Object.defineProperty(target, key, {
            get() {
                return value;
            },
            set(newValue: any) {
                value.value = newValue
            },
        })
    }
}

export function Computed(dependencies: string[]|Function) {
    return function(target: any, key: string) {
        const func = target[key];

        const deps: Hook[] = typeof dependencies === 'function' ? dependencies(target) : dependencies.map(d => target[d]);

        let hook;

        return {
            get() {
                if (!hook) {
                    hook = _computed(() => {
                        return func.call(target)
                    }, deps)
                }
                return hook;
            },
        }
    }
}

export function Watch(dependencies: string[]|Function) {
    return function(target: any, key: string) {
        const func = target[key];

        const deps: Hook[] = typeof dependencies === 'function' ? dependencies(target) : dependencies.map(d => target[d]);

        _watch(deps, () => {
            return func.call(target)
        })
    }
}

export function CustomElement(name: string) {
    return function(target: any) {
        window.customElements.define(name, target)
    }
}

export function Attribute(options = {}) {
    return (target: any, key: string) => {
        target.addAttributeListener(key, options)
    }
}