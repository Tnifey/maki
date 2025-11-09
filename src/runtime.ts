import type { AnyMakiComponent, MakiComponent } from "./component";

/**
 * Current component context
 * @private
 */
let currentContext: AnyMakiComponent = null;

/**
 * Set the current component context
 * @param component - Component to set as current context
 */
export function setCurrentContext<T>(component: MakiComponent<T>) {
    currentContext = component as AnyMakiComponent;
}

/**
 * Get the current component context
 * @param hook - Hook name for error message
 * @returns Current component context
 * @throws Error if called outside of a component
 */
export function getCurrentContext(hook: string): AnyMakiComponent {
    if (!currentContext) {
        throw new Error(`Cannot call ${hook} outside of a maki component`);
    }
    return currentContext;
}
