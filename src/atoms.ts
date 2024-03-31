import { atom, getDefaultStore } from "jotai/vanilla";

export { atom, getDefaultStore } from "jotai/vanilla";

export type Atom<T> = ReturnType<typeof atom<T>>;

export type Guard<T> = (value: T, prev: T) => T;

export type Isotope<T> = ReturnType<typeof isotope<T>>;

export function getAtomValue<T>(value: Atom<T>) {
    return getDefaultStore().get(value);
}

export function setAtomValue<T>(
    value: Atom<T>,
    fn: T | ((prev: T) => T),
) {
    return getDefaultStore().set(value, fn);
}

export function atomSubscribe<T>(
    value: Atom<T>,
    fn: (value: T) => void,
) {
    return getDefaultStore().sub(value, () => fn(getAtomValue(value)));
}

/**
 * Naive type check for atom
 * Checks if value has read, write, and toString methods
 */
export function isAtom<T = unknown>(
    value: unknown | Atom<T>,
): value is Atom<T> {
    const v = value as Atom<T>;
    return (
        typeof v?.read === "function" &&
        typeof v?.write === "function" &&
        typeof v?.toString === "function"
    );
}

/**
 * Convert value to atom
 */
export function toAtom<T>(
    value: T | Atom<T>,
): Atom<T> {
    if (isIsotope(value)) return value.atom as Atom<T>;
    if (isAtom(value)) return value;
    return atom<T>(value);
}

/**
 * Atom with persistent storage in localStorage. It will be JSON serialized.
 * @param key - Storage key
 * @param defaultValue - Initial value.
 * @returns Atom with persistent storage
 */
export function persistentAtom<T>(key: string, defaultValue: T) {
    const stored = window.localStorage.getItem(key);
    const state = atom<T>(stored ? (JSON.parse(stored) as T) : defaultValue);

    atomSubscribe(state, (value) => {
        window.localStorage.setItem(key, JSON.stringify(value));
    });

    return state;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isFunction(value: any): value is (...args: any[]) => any {
    return typeof value === "function";
}

export const ISOTOPE: unique symbol = Symbol("isotope");

export function isIsotope(value: unknown): value is Isotope<unknown> {
    return isAtom(value) && typeof value === "function" && value[ISOTOPE] === true;
}

/**
 * Atom on steroids
 * @param value - atom-like or value
 * @param guard - function to validate - (value, prev) => value
 * @returns getter, setter, atom
 */
export function isotope<T>(value: T | Atom<T>, guard?: Guard<T>) {
    const atom = toAtom(value);

    const getter = () => getAtomValue(atom);
    const setter = typeof guard === "function" ? (set: T | ((x: T) => T)) => {
        const value = getAtomValue(atom);
        return setAtomValue(atom, guard(isFunction(set) ? set(value) : set, value));
    } : (set: T | ((x: T) => T)) => {
        return setAtomValue(atom, isFunction(set) ? set(getAtomValue(atom)) : set);
    };
    const sub = (fn: () => void) => atomSubscribe(atom, fn);

    /**
     * Get atom value
     */
    function getset(): T;
    /**
     * Set atom value
     * @param fn - New value or function to update previous value
     */
    function getset(fn: T | ((x: T) => T)): void;
    function getset(...args: [T | ((x: T) => T)] | []) {
        if (args.length) return setter(args[0]);
        return getter();
    }

    return Object.assign(getset, atom, [getter, setter, atom] as const, {
        atom, [ISOTOPE]: true,
        subscribe: sub,
        [Symbol.iterator]: function* () {
            yield getter;
            yield setter;
            yield atom;
        },
    } as const);
}
