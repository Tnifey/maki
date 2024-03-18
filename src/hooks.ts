import { type Atom, atomSubscribe, getAtomValue, setAtomValue, toAtom } from "./atoms";
import { getCurrentContext } from "./runtime";

export type Use<T> = ReturnType<typeof use<T>>;
export function use<T>(initialValue: T | Atom<T>) {
    const context = getCurrentContext();
    if (!context) throw new Error("Cannot call use() outside of a component");
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
