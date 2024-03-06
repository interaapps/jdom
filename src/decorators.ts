import { state as _state, computed as _computed, bind as _bind } from './hooks.js'
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

        let deps: Hook[];
        if (typeof dependencies === 'function') {
            deps = dependencies(target)
        } else {
            deps = dependencies.map(d => target[d])
        }

        const hook = _computed(() => {
            return func.call(target)
        }, deps)

        return {
            get() {
                return hook;
            },
        }
    }
}

export function CustomElement(name: string) {
    return function(target: any) {
        window.customElements.define(name, target)
    }
}

export function Attribute() {
    return (target: any, key: string) => {
    }
}