import { $, $c, $n, html, state } from '../../index.js'


export default class Router {
    constructor(routes = []) {
        this.view = state(null)
        this.currentPath = state(null)

        this.link = (to, text) => $n('a').attr('href', to).text(text).click(e => {
            this.go(to)
            e.preventDefault()
        })

        this.routes = routes
    }

    getPath(to) {
        if (typeof to === 'string')
            return to
    }

    async go(to) {
        const path = this.getPath(to)
        window.history.pushState(path, path, path)
        await this.run(to)
    }

    async run(path = window.location.pathname) {
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
                const query = new URLSearchParams(window.location.search)
                this.currentPath.value = {
                    path: currentPath,
                    route,
                    query: new Proxy(new URLSearchParams(window.location.search), {
                        get: (searchParams, prop) => searchParams.get(prop),
                    }),
                    hash: window.location.hash,
                    params
                }

                this.view.value = html`${typeof view === 'function' && !(view instanceof Node) ? await view(this.currentPath) : view}`.nodes()

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