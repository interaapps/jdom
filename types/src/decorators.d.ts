import Hook from "./Hook.js";
interface AttributeOptions {
    name?: String;
}
export declare function State(): (target: any, key: string) => void;
export declare function Computed(dependencies: string[] | ((target: any) => Hook<any>[])): (target: any, key: string) => {
    get(): any;
};
export declare function Watch(dependencies: string[] | Function): (target: any, key: string) => void;
export declare function CustomElement(name: string): (target: any) => void;
export declare function Attribute(options?: AttributeOptions): (target: any, key: string) => void;
export {};
