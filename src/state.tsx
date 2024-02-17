export type State<T> = ReturnType<typeof createState<T>>;

export function createState<T>(initialValue: T) {
    const observers: any[] = [];
    let state = { value: initialValue };

    function setState(newState: T) {
        if (typeof newState === 'function') {
            return setState(newState());
        }
        state.value = newState;
        trigger();
    }

    function trigger() {
        for (const observer of observers) {
            observer(state.value);
        }
    }

    function watch(observer: (state: T) => void) {
        if (typeof observer !== 'function') throw Error('Observer must be a function');
        observers.push(observer);
        return function unwatch() {
            const index = observers.indexOf(observer);
            observers.splice(index, 1);
        };
    }

    return {
        state: () => state.value,
        setState,
        watch,
        trigger,
    } as const;
}
