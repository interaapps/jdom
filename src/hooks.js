import Hook from './Hook.js'

/**
 * @template T
 * @param {T} initialValue
 * @return {Hook}
 */
export function state(initialValue) {
    return new Hook(initialValue)
}

/**
 *
 * @param {function()} callable
 * @param {Hook[]} dependencies
 * @return {Hook}
 */
export function computed(callable, dependencies = []) {
    const hook = new Hook(callable())

    for (let dependency of dependencies) {
        dependency.listeners.push(() => {
            hook.value = callable()
        })
    }

    return hook
}

/**
 * @param {Hook[]} hooks
 * @param {function()} callable
 */
export function watch(hooks, callable) {
    for (let hook of hooks) {
        hook.addListener(callable)
    }
}


/**
 * @param {JDOMComponent} component
 * @param {string} attr
 * @return {Hook}
 */
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