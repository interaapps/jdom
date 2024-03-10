import { $n, html, state } from '../../index.js'

/**
 * @typedef Route
 * @property {string} name
 * @property {string} path
 * @property {string} path
 */

/**
 * @typedef CurrentRoute
 * @property {string} path
 * @property {Object} query
 * @property {string} hash
 * @property {Object.<String, String>} params
 * @property {Route} route
 */

export default class Router {

    /**
     * @type {Hook<CurrentRoute>}
     */
    currentRoute

    /**
     * @type Route[]
     */
    routes = []

    /**
     * @param {Route[]} routes
     */
    constructor(routes = []) {
        this.view = state(null)
        this.currentRoute = state(null)

        this.link = (to, text) => $n('a').attr('href', to).text(text).click(e => {
            this.go(to)
            e.preventDefault()
        })

        this.routes = routes
    }

    /**
     * @param to
     * @return {CurrentRoute|string}
     */
    getPath(to) {
        if (typeof to === 'string')
            return to

        const route = this.routes.find((n => n.name === to))
        let path = route.path

        if (to.params) {
            for (const [key, value] of to.params) {
                path = path.replace(`:${key}`, value)
            }
        }

        if (to.query) {
            if (typeof to.query === 'string') {
                path += to.query.startsWith('?') ? to.query : `${to.query}`
            } else {
                path += '?' + Object.keys(to.query)
                    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                    .join('&')
            }
        }

        if (to.hash && to.hash !== '#') {
            path += to.hash.startsWith('#') ? to.hash : `#${to.hash}`
        }

        return path
    }

    /**
     * @param to
     * @return {Promise<void>}
     */
    async go(to, reloadIfChanged = true) {
        [to] = to.split('?', 1)
        [to] = to.split('#', 1)
        const path = this.getPath(to)
        window.history.pushState(path, path, path)

        await this.run(reloadIfChanged)
    }

    /**
     * @param {boolean} reloadIfChanged
     * @return {Promise<void>}
     */
    async run(reloadIfChanged = true) {
        const currentPath = window.location.pathname
        for (const route of this.routes) {
            const {name, path, view} = route

            const splitPath = path.split('/')
            const splitCurrentPath = currentPath.split('/')

            if (splitPath.length !== splitCurrentPath.length)
                continue

            let isCorrect = true
            const params = {}

            for (let ind in splitPath) {
                if (!isCorrect) continue
                const item = splitPath[ind]

                const currentPathItem = splitCurrentPath[ind]
                if (currentPathItem === undefined) isCorrect = false;

                if (item === currentPathItem)
                    continue;

                if (item.length > 0 && item[0] === ':') {
                    params[item.substring(1)] = currentPathItem
                    continue
                }

                isCorrect = false
            }

            if (isCorrect) {
                const latestRoute = this.currentRoute.value?.route
                this.currentRoute.value = {
                    path: currentPath,
                    name,
                    route,
                    query: new Proxy(new URLSearchParams(window.location.search), {
                        get: (searchParams, prop) => searchParams.get(prop),
                    }),
                    hash: window.location.hash,
                    params
                }

                if (!reloadIfChanged && latestRoute === route)
                    break;

                this.view.value = html`${typeof view === 'function' && !(view instanceof Node) ? await view(this.currentRoute) : view}`.nodes()
                break
            }
        }
    }

    async init() {
        window.addEventListener('popstate', () => {
            this.run()
        })
        this.run()
    }
}