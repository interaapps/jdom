export function ForEach({ value, content }: {
    value: any;
    content: any;
}): Hook<any>;
export function Awaiting({ promise, awaiting, finished, error }: {
    promise?: any;
    awaiting?: any;
    finished?: any;
    error?: any;
}): Hook<any>;
import Hook from '../../Hook.js';
