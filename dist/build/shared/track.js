//
export function track(value) {
    return new Proxy(value, {
        get(target, prop, receiver) {
            console.warn(`GET(): '${String(prop)}' on object accessed:`, `value:`, target[prop], `receiver:`, receiver);
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            console.warn(`SET(): Property '${String(prop)}' on object changed from`, target[prop], `to`, value);
            return Reflect.set(target, prop, value, receiver);
        },
    });
}
