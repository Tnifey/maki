import { type MakiComponent } from "./maki";

export const runtime = {
    currentContext: null as MakiComponent<any> | null,
    contexts: new Map() as Map<string, MakiComponent<any>>,
    setCurrentContext<T>(component: MakiComponent<T>) {
        this.currentContext = component;
    },
    getCurrentContext(): MakiComponent<any> | null {
        return this.currentContext;
    }
} as const;
