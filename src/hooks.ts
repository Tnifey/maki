import { type Atom, atomSubscribe, getAtomValue, setAtomValue, toAtom } from "./atoms";
import * as runtime from "./runtime";

export type Use<T> = ReturnType<typeof use<T>>;
export function use<T>(initialValue: T | Atom<T>) {
    const context = getCurrent("tome()");
    const atomic = toAtom(initialValue);
    const unsub = atomSubscribe(atomic, () => context.render());
    const getter = () => getAtomValue(atomic);
    const setter = (fn: T | ((x: T) => T)) => setAtomValue(atomic, fn);

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

    return Object.assign(getset, atomic, { unsub }, [getter, setter, atomic] as const);
}

export function getCurrent(who: string) {
    const current = runtime.getCurrentContext();
    if (!current) throw new Error(`Cannot call ${who} outside of a component`);
    return current;
}

export function useEmit() {
    const context = getCurrent("useEmit()");
    return function emit(name: string, init?: CustomEventInit) {
        return context.dispatchEvent(new CustomEvent(name, init));
    };
}

export function useRender() {
    const context = getCurrent("useRender()");
    return function render() {
        return context.render();
    };
}
