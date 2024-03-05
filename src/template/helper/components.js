import Hook from '../Hook.js'
import { computed, state } from '../hooks.js'
import { html } from '../template.js'

export function ForEach({ value, content }) {
    if (!(value instanceof Hook))
        value = new Hook(value)

    return computed(() => value.value.map((value, index) => content(value, index)), [value])
}

export function Awaiting({ promise = null, awaiting = null, finished = null, error = null }) {
    const currentState = state(awaiting ? (typeof awaiting === 'function' ? awaiting(v) : awaiting) : null)

    if (promise === null) {
        throw new Error('No promise given')
    }

    promise
        .then(v => {
            currentState.value = finished === null ? v : (typeof finished === 'function' ? finished(v) : finished)
            return v
        })
        .catch(v => {
            currentState.value = error === null ? null : (typeof error === 'function' ? error(v) : error)
            return v
        })

    return currentState
}