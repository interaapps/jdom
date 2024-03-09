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
     * @param {Route[]} routes
     */
    constructor(routes?: Route[]);
    /**
     * @type {Hook<CurrentRoute>}
     */
    currentRoute: Hook<CurrentRoute>;
    /**
     * @type Route[]
     */
    routes: Route[];
    view: import("src/Hook.js").default<null>;
    link: (to: any, text: any) => any;
    /**
     * @param to
     * @return {CurrentRoute|string}
     */
    getPath(to: any): CurrentRoute | string;
    /**
     * @param to
     * @return {Promise<void>}
     */
    go(to: any): Promise<void>;
    /**
     * @param {string} currentPath
     * @return {Promise<void>}
     */
    run(currentPath?: string): Promise<void>;
    init(): Promise<void>;
}
export type Route = {
    name: string;
    path: string;
};
export type CurrentRoute = {
    path: string;
    query: Object;
    hash: string;
    params: any;
    route: Route;
};
