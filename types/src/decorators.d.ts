import Hook from "./Hook.js";
export declare function State(): (target: any, key: string) => void;
export declare function Computed(dependencies: string[] | ((target: any) => Hook<any>[])): (target: any, key: string) => {
    get(): any;
};
export declare function Watch(dependencies: string[] | Function): (target: any, key: string) => void;
export declare function CustomElement(name: string): (target: any) => void;
export declare function Attribute(options?: {}): (target: any, key: string) => void;
