import { type Atom, atomSubscribe, getAtomValue, setAtomValue, toAtom } from "./atoms";
import { getCurrentContext } from "./runtime";

export type Use<T> = ReturnType<typeof use<T>>;

export type Guard<T> = (value: T, prev: T) => T;

export const USE: unique symbol = Symbol("use");

export function use<T>(
    initialValue: T | Atom<T>,
    /**
     * Guard function. It is called every time the value is set. If the guard function returns a different value, the value is updated.
     * @param value Current value
     * @param prev Previous value
     * @returns New value
     */
    guard?: Guard<T>,
) {
    const context = getCurrentContext();
    if (!context) throw new Error("Cannot call use() outside of a component");

    const atomic = toAtom(initialValue);
    const unsub = atomSubscribe(atomic, () => context.render());
    const getter = () => getAtomValue(atomic);
    const setter = typeof guard === "function" ? (set: T | ((x: T) => T)) => {
        const value = getAtomValue(atomic);
        return setAtomValue(atomic, guard(isFunction(set) ? set(value) : set, value));
    } : (set: T | ((x: T) => T)) => {
        return setAtomValue(atomic, isFunction(set) ? set(getAtomValue(atomic)) : set);
    };

    /**
     * Get atom value
     * @returns Atom value
     */
    function getset(): T;
    /**
     * Set atom value
     */
    function getset(fn: T | ((x: T) => T)): void;
    function getset(...args: [T | ((x: T) => T)] | []) {
        if (args.length) return setter(args[0]);
        return getter();
    }

    const use = Object.assign(getset, atomic, { unsub, [USE]: true, atom: atomic }, [getter, setter, atomic] as const);

    Object.assign(use, {
        [Symbol.iterator]: function* () {
            yield getter;
            yield setter;
            yield atomic;
        },
    });

    return use as typeof use;
}

export function isUseResult(value: unknown): value is Use<unknown> {
    return typeof value === "function" && value[USE] === true;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isFunction(value: any): value is (...args: any[]) => any {
    return typeof value === "function";
}
