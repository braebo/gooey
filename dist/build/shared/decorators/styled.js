/**
 * A class decorator that creates a style element in the head of the document when the class is
 * instantiated.  The style element is created with the `style` property of the class.  The style
 * element is only created once, and subsequent instantiations of the class will not create another
 * style element.
 */
function styled(constructor) {
    return class extends constructor {
        static initialized = false;
        static stylesheet;
        constructor(...args) {
            super(...args);
            if (typeof globalThis.document !== 'undefined') {
                const dis = this.constructor;
                if (!dis.style || dis.initialized) {
                    return;
                }
                dis.initialized = true;
                if (!dis.stylesheet) {
                    const stylesheet = document.createElement('style');
                    stylesheet.innerHTML = dis.style;
                    document.head.appendChild(stylesheet);
                    dis.stylesheet = stylesheet;
                }
            }
            else {
                throw new Error('@styled components can only be used in the browser');
            }
        }
    };
}

export { styled };
//# sourceMappingURL=styled.js.map
