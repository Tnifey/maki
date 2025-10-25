/**
 * Get the event target, considering composed events. A helper function to retrieve
 * the event target in cases where Shadow DOM is involved.
 * If the event is composed, return the first element in the composed path.
 * Otherwise, return the event target.
 * @param event - Event object
 * @returns Event target or first element in the composed path
 *
 * Same as event.composedPath()[0] if composed
 * Otherwise same as event.target
 *
 * @example
 * element.addEventListener("click", (event) => {
 *    const target = getEventTarget(event);
 *    console.log(target);
 * });
 */
export function getEventTarget(event: Event): EventTarget | null {
    if (event?.composed) return event.composedPath()?.[0];
    return event?.target;
}
