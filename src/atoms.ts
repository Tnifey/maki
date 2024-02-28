import { atom, getDefaultStore } from "jotai/vanilla";

export { atom, getDefaultStore } from 'jotai/vanilla';

/**
 * Naive type check for atom
 * Checks if value has read, write, and toString methods
 */
export function isAtom(value: any): value is ReturnType<typeof value> {
    return typeof value?.read === 'function'
        && typeof value?.write === 'function'
        && typeof value?.toString === 'function';
}

export function toAtom(value: any) {
    return isAtom(value) ? value : atom(value);
}

export function getAtomValue<T>(value: ReturnType<typeof atom<T>>) {
    return getDefaultStore().get(value);
}

export function setAtomValue<T>(value: ReturnType<typeof atom<T>>, fn: T | ((prev: T) => T)) {
    return getDefaultStore().set(value, fn);
}

export function atomSubscribe<T>(value: ReturnType<typeof atom<T>>, fn: (value: T) => void) {
    return getDefaultStore().sub(value, () => fn(getAtomValue(value)));
}

export function persistentAtom<T>(key: string, initialValue: T) {
    const stored = window.localStorage.getItem(key);
    const state = atom<T>(stored ? JSON.parse(stored) as T : initialValue);

    atomSubscribe(state, (value) => {
        window.localStorage.setItem(key, JSON.stringify(value));
    });

    return state;
}

/**
 * Use atom without attaching to a component
 * @param value - Atom
 * @returns Atom value and setter
 * @example
 * const $list = atom<string[]>([]);
 * const [list, setList] = useAtom($list);
 */
export function useAtom<T>(value: ReturnType<typeof atom<T>>) {
    const store = getDefaultStore();
    return [
        /**
         * Get atom value
         * @returns Atom value
         * @example
         * const $list = atom<string[]>([]);
         * const [list] = useAtom($list);
         * list() // []
         */
        function get() { store.get(value); },
        /**
         * Set atom value
         * @param fn - New value or function to update previous value
         * @example
         * const $list = atom<string[]>([]);
         * const [_, setList] = useAtom($list);
         * setList((list) => [...list, "Item"]);
         */
        function set(fn: T | ((prev: T) => T)) { store.set(value, fn); },
        /**
         * Subscribe to atom changes
         * @param fn - Function to run on atom change
         */
        function sub(fn: () => void) { return store.sub(value, fn); },
        /**
         * Atom
         */
        value,
    ] as const;
}
