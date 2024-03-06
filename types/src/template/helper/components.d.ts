export function ForEach({ value, content }: {
    value: any;
    content: any;
}): Hook<any>;
export function Awaiting({ promise, awaiting, finished, error }: {
    promise?: null | undefined;
    awaiting?: null | undefined;
    finished?: null | undefined;
    error?: null | undefined;
}): Hook<any>;
import Hook from '../../Hook.js';
