import type { AnyMakiComponent, MakiComponent } from "./component";

export const contexts = new Map() as Map<string, AnyMakiComponent>;

export let currentContext: AnyMakiComponent = null;

export function setCurrentContext<T>(component: MakiComponent<T>) {
    currentContext = component as AnyMakiComponent;
}

export function getCurrentContext(): AnyMakiComponent {
    return currentContext;
}
