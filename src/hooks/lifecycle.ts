import { getCurrentContext } from "../runtime";
import type { LifecycleFn } from "../component";

export function onConnected(fn: LifecycleFn) {
    const context = getCurrentContext();
    if (!context)
        throw new Error(
            "Cannot call onConnected() outside of a maki component",
        );
    context.onConnected.push(fn);
}

export function onBeforeConnect(fn: LifecycleFn) {
    const context = getCurrentContext();
    if (!context)
        throw new Error(
            "Cannot call onBeforeConnect() outside of a maki component",
        );
    context.onBeforeConnect.push(fn);
}

export function onDisconnected(fn: LifecycleFn) {
    const context = getCurrentContext();
    if (!context)
        throw new Error(
            "Cannot call onDisconnected() outside of a maki component",
        );
    context.onDisconnected.push(fn);
}
