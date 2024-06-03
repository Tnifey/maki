import { Directive, directive } from "lit-html/directive.js";
import { isotope } from "../state";

const getReferenceElementDirective = directive(class extends Directive {
    render(..._: Array<unknown>) { }
    update(part, [callback]: [((element: unknown) => void)]) {
        callback(part?.element);
    }
});

export function useRef<T>(defaults: T = null) {
    const current = isotope<T>(defaults);
    return Object.assign(() => getReferenceElementDirective((element: T) => current(element)), { current } as const);
}
