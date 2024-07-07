export function isType<const T extends any, const U extends string = string>(
	value: T | boolean | undefined,
	type: U,
): value is NonNullable<T> & { __type: U }
export function isType(value: any, type: 'number'): value is number
export function isType(value: any, type: 'string'): value is string
export function isType(value: any, type: 'boolean'): value is boolean
export function isType(value: any, type: 'function'): value is (...args: any[]) => any
export function isType<const _T extends any, const U extends string>(
	value: any,
	type: U | 'number' | 'string' | 'boolean' | 'function' | 'object',
): boolean {
	if (typeof value !== 'object' || value === null || ['object', 'function'].includes(type)) {
		return typeof value === type
	}
	return '__type' in value && (value as any)['__type'] === type
}
