import { getCurrentContext } from "../runtime";
import { type Atom, type Guard, isotope } from "../state";

/**
 * Attach atom to a component. It will re-render the component whenever the atom changes.
 * Needs to be called inside a component. It will throw an error if called outside of a component.
 * @param initialValue - Initial value or atom
 * @param guard - Guard function
 * @returns isotope
 */
export function use<T>(initialValue: T | Atom<T>, guard?: Guard<T>) {
    const context = getCurrentContext();
    if (!context) throw new Error("Cannot call use() outside of a component");

    const atom = isotope(initialValue, guard);
    return Object.assign(atom, {
        /**
         * Unsubscribe use hook
         */
        unsub: atom.subscribe(() => context.render()),
    });
}
