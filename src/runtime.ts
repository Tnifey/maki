import type { AnyMakiComponent, MakiComponent } from "./component";

let currentContext: AnyMakiComponent = null;

export function setCurrentContext<T>(component: MakiComponent<T>) {
    currentContext = component as AnyMakiComponent;
}

export function getCurrentContext(): AnyMakiComponent {
    return currentContext;
}
