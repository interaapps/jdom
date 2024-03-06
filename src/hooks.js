import Hook from './Hook.js'
import JDOMComponent from './JDOMComponent.js'


export function state(initialValue) {
    return new Hook(initialValue)
}


export function computed(callable, dependencies = []) {
    const hook = new Hook(callable())

    for (let dependency of dependencies) {
        dependency.listeners.push(() => {
            hook.value = callable()
        })
    }

    return hook
}

export function watch(hooks, callable) {
    for (let hook of hooks) {
        hook.addListener(callable)
    }
}

export function bind(component, attr = 'value') {
    const hook = new Hook(component[attr])

    component.addEventListener(`input:${attr}`, () => {
        hook.value = component[attr]
    })

    hook.addListener(val => {
        if (component[attr] !== val) {
            component[attr] = hook.value
        }
    })

    return hook
}