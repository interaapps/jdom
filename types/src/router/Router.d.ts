export default class Router {
    constructor(routes?: any[]);
    view: import("../Hook.js").default<any>;
    currentPath: import("../Hook.js").default<any>;
    link: (to: any, text: any) => any;
    routes: any[];
    getPath(to: any): string;
    go(to: any): Promise<void>;
    run(path?: string): Promise<void>;
    init(): Promise<void>;
}
