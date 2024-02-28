import { type MakiComponent } from "./component";

export const contexts = new Map() as Map<string, MakiComponent<any>>;

export let currentContext = null as MakiComponent<any> | null;

export function setCurrentContext<T>(component: MakiComponent<T>) {
    currentContext = component;
}

export function getCurrentContext(): MakiComponent<any> | null {
    return currentContext;
}
