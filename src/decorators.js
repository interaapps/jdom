import { state as _state, computed as _computed, watch as _watch, bind as _bind } from './hooks.js'
import Hook from "./Hook.js";
import JDOM from "./JDOM.js";
import JDOMComponent from "./JDOMComponent.js";

/* export function State() {
    return function (target: any, key: string) {
        const value = _state(target[key]?.value);

        Object.defineProperty(target, key, {
            get() {
                return value;
            },
            set(newValue: any) {
                value.value = newValue
            },
            configurable: true
        })
    }
}

export function Computed(dependencies: string[] | ((target: any) => Hook<any>[])) {
    return function(target: any, key: string) {
        const func = target[key];

        const deps: Hook<any>[] = typeof dependencies === 'function' ? dependencies(target) : dependencies.map(d => target[d]);

        let hook: any = undefined;

        return {
            get() {
                console.log('Ex', target, window.example)
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

        const deps: Hook<any>[] = typeof dependencies === 'function' ? dependencies(target) : dependencies.map(d => target[d]);

        _watch(deps, () => {
            return func.call(target)
        })
    }
}*/

/**
 *
 * @param {string|undefined} name
 * @return {(function(*): void)|*}
 * @constructor
 */
export function CustomElement(name = undefined) {
    return function(target) {
        if (name === undefined) {
            JDOM.registerComponent([target])
            return;
        }
        JDOM.registerComponent(name, target);
    }
}

/*
export function Attribute(options: AttributeOptions = {}) {
    return (target: any, key: string) => {
        target.addAttributeListener(key, options)
    }
}*/