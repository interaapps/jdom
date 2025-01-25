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
    view: Hook<any>;
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
    go(to: any, reloadIfChanged?: boolean): Promise<void>;
    /**
     * @param {boolean} reloadIfChanged
     * @return {Promise<void>}
     */
    run(reloadIfChanged?: boolean): Promise<void>;
    init(): Promise<void>;
}
export type Route = {
    name: string;
    path: string;
};
export type CurrentRoute = {
    path: string;
    query: any;
    hash: string;
    params: any;
    route: Route;
};
import Hook from '../Hook.js';
