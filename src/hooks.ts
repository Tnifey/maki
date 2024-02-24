import { atom } from "jotai/vanilla";
import { runtime } from "./runtime";
import { atomSubscribe, getAtomValue, setAtomValue, toAtom } from "./atoms";

export function use<T>(initialValue: T | ReturnType<typeof atom<T>>) {
    const context = getCurrent('use()');
    const atomic = toAtom(initialValue) as ReturnType<typeof atom<T>>;
    atomSubscribe(atomic, () => context.render());
    return [
        () => getAtomValue(atomic),
        (fn: T | ((prev: T) => T)) => setAtomValue(atomic, fn),
        atomic,
    ] as const;
}

export function getCurrent(who: string) {
    const current = runtime.getCurrentContext();
    if (!current) throw new Error(`Cannot call ${who} outside of a component`);
    return current;
}

export function useEmit() {
    const context = getCurrent('useEmit()');
    return function emit(name: string, init?: CustomEventInit) {
        return context.dispatchEvent(new CustomEvent(name, init));
    };
}

export function useRender() {
    const context = getCurrent('useRender()');
    return function render() {
        return context.render();
    };
}
