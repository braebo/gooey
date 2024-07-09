// import { ColorPickerOptions } from './ColorPicker'
export function cssGradient(type, direction, stops) {
    return `${type}-gradient(${direction}, ${stops.map(([o, col]) => `${col} ${o}%`).join(',')})`;
}
export function cssValue(value) {
    if (typeof value === 'string')
        return value;
    return `${value}px`;
}
