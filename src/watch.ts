import { type Use, isUse } from "./hooks";
import { type Atom, isAtom, atomSubscribe } from "./atoms";

/**
 * Watch atom changes. Calls the callback function whenever any of the dependencies change.
 * Dependencies should be atoms or use() results. Dependencies should be unique,
 * if the same atom or use() result is used multiple times, only the first one will be used.
 * That is, the second and subsequent dependencies will be ignored.
 * @param fn - Callback function
 * @param deps - Dependencies
 * @returns Unsubscribe function
 * 
 * @example
 * watch(() => {
 *    someting_to_do_on_dependency_change();
 * }, [value, other]);
 * 
 * @example
 * const unsub = watch(() => {
 *    someting_to_do_on_dependency_change();
 *    unsub(); // unsubscribe after first change
 * }, [value, other]);
 * 
 * @example
 * const unsub = watch(() => {
 *    someting_to_do_on_dependency_change();
 *    if (value() === 10) unsub(); // unsubscribe after value is 10
 * }, [value, other]);
 */
export function watch(fn: () => void, deps: (Atom<unknown> | Use<unknown>)[] = []) {
    const unsubs: (() => void)[] = deps.map((dep, i, all) => {
        if (all.indexOf(dep) !== i) return console.warn([
            "watch() dependencies should be unique",
            "Use the same atom or use() result only once",
            "Second and subsequent dependencies will be ignored",
        ].join("\n"));
        if (!isAtom(dep)) throw new Error("watch() can only watch atoms or use() results");
        return atomSubscribe(isUse(dep) ? dep.atom : dep, fn);
    }).filter(Boolean) as (() => void)[];

    // biome-ignore lint/complexity/noForEach: <explanation>
    return () => unsubs.forEach((unsub) => unsub());
}
