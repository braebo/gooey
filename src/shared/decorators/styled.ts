export interface Styled {
	initialized: boolean
	stylesheet: HTMLStyleElement
}

/**
 * A class decorator that creates a style element in the head of the document when the class is
 * instantiated.  The style element is created with the `style` property of the class.  The style
 * element is only created once, and subsequent instantiations of the class will not create another
 * style element.
 */
export function styled<T extends { new (...args: any[]): {}; style: string }>(
	constructor: T,
): T & Styled {
	return class extends constructor {
		static initialized = false
		static stylesheet: HTMLStyleElement

		constructor(...args: any[]) {
			super(...args)

			if (typeof globalThis.document !== 'undefined') {
				const dis = this.constructor as typeof constructor & {
					initialized: boolean
					stylesheet?: HTMLStyleElement
				}

				if (!dis.style || dis.initialized) {
					return
				}

				dis.initialized = true

				if (!dis.stylesheet) {
					const stylesheet = document.createElement('style')
					stylesheet.innerHTML = dis.style
					document.head.appendChild(stylesheet)
					dis.stylesheet = stylesheet
				}
			} else {
				throw new Error('@styled components can only be used in the browser')
			}
		}
	}
}
