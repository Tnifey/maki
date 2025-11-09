import type { LifecycleFn } from "../component";
import { getCurrentContext } from "../runtime";

export function onConnected(fn: LifecycleFn) {
    const context = getCurrentContext("onConnected");
    context.onConnected.push(fn);
}

export function onBeforeConnect(fn: LifecycleFn) {
    const context = getCurrentContext("onBeforeConnect");
    context.onBeforeConnect.push(fn);
}

export function onDisconnected(fn: LifecycleFn) {
    const context = getCurrentContext("onDisconnected");
    context.onDisconnected.push(fn);
}
