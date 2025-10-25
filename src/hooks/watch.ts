import {
    type Atom,
    type Isotope,
    atomSubscribe,
    isAtom,
    isIsotope,
} from "../state";

/**
 * Watch atom changes. Calls the callback function whenever any of the dependencies change.
 * Dependencies should be atoms, isotopes or use() results. Dependencies should be unique,
 * if the same atom, isotopes or use() result is used multiple times, only the first one will be used.
 * That is, the second and subsequent dependencies will be ignored.
 * You can use watch outside of the component.
 * It should be noted that the callback function is called asynchronously.
 * We await the next tick to call the callback function. If dependencies change multiple times within the same tick,
 * the callback function will only be called once.
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
export function watch(
    fn: () => void,
    deps: (Atom<unknown> | Isotope<unknown>)[] = [],
) {
    if (typeof fn !== "function")
        throw new Error("watch() requires a function as the first argument");
    if (!Array.isArray(deps))
        throw new Error("watch() dependencies should be an array");
    if (deps.length === 0)
        throw new Error("watch() requires at least one dependency");

    let callee = 0;

    const unsubs: (() => void)[] = deps
        .map((dep, i, all) => {
            if (!isAtom(dep))
                throw new Error(
                    "watch() can only watch atoms, isotopes, use() results",
                );
            if (all.indexOf(dep) !== i)
                return console.warn(
                    [
                        "watch() dependencies should be unique",
                        "Use the same atom, isotope or use() result only once",
                        "Second and subsequent dependencies will be ignored",
                    ].join("\n"),
                );

            return atomSubscribe(isIsotope(dep) ? dep.atom : dep, () => {
                if (!callee)
                    Promise.resolve()
                        .then(() => {
                            fn();
                        })
                        .catch(console.error)
                        .finally(() => {
                            callee = 0;
                        });
                callee++;
            });
        })
        .filter(Boolean) as (() => void)[];

    if (unsubs.length === 0)
        throw new Error(
            [
                "watch() requires at least one valid dependency",
                "Dependencies should be atoms, isotopes or use() results",
            ].join("\n"),
        );

    /**
     * Unsubscribe watch
     * @example
     * const unsub = watch(() => { }, []);
     * unsub();
     */
    return () => {
        // biome-ignore lint/complexity/noForEach: <explanation>
        unsubs.forEach((unsub) => typeof unsub === "function" && unsub());
    };
}
