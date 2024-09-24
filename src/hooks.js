import Hook from './Hook.js'

/**
 * @template T
 * @param {T} initialValue
 * @return {Hook<T>}
 */
export function state(initialValue) {
    return new Hook(initialValue)
}

/**
 * If dependencies is not given, the dependencies will be automatically seletected
 *
 * @template T
 * @param {function(): T} callable
 * @param {Hook[]|undefined} dependencies
 * @return {Hook<T>}
 */
export function computed(callable, dependencies = undefined) {
    const hook = new Hook(callable())

    if (dependencies === undefined) {
        Hook.enableTracking()
        callable()

        for (const trackedElement of Hook.getTracked()) {
            trackedElement.addListener(() => {
                hook.value = callable()
            })
        }
        Hook.disableTracking()
    } else {
        for (let dependency of dependencies) {
            dependency.listeners.push(() => {
                hook.value = callable()
            })
        }
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