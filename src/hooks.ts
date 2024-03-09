import { type Atom, atomSubscribe, getAtomValue, setAtomValue, toAtom } from "./atoms";
import * as runtime from "./runtime";

export function use<T>(initialValue: T | Atom<T>) {
    const context = getCurrent("use()");
    const atomic = toAtom(initialValue) as Atom<T>;
    atomSubscribe(atomic, () => context.render());
    return [
        () => getAtomValue(atomic),
        (fn: T | ((prev: T) => T)) => setAtomValue(atomic, fn),
        atomic,
    ] as const;
}

export function tome<T>(initialValue: T | Atom<T>) {
    const context = getCurrent("tome()");
    const atomic = toAtom(initialValue);
    atomSubscribe(atomic, () => context.render());

    function get() {
        return getAtomValue(atomic);
    }

    function set(fn: T | ((prev: T) => T)) {
        return setAtomValue(atomic, fn);
    }

    return Object.assign(get, atomic, { set });
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
