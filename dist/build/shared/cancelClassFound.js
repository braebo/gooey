/**
 * Checks if an event's composed path contains an element with the provided classname.
 */
export function composedPathContains(e, classname) {
    return e.composedPath().some(n => n.classList?.contains(classname));
}
