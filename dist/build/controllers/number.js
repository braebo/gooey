import { create } from '../shared/create.js';

const rangeController = (input, opts, parent) => {
    const range = create('input', {
        type: 'range',
        classes: ['fracgui-controller', 'fracgui-input-number-range'],
        value: String(input.state.value),
        parent,
    });
    if ('min' in opts)
        range.min = String(opts.min);
    if ('max' in opts)
        range.max = String(opts.max);
    if ('step' in opts)
        range.step = String(opts.step);
    input.listen(range, 'input', input.set.bind(input));
    return range;
};

export { rangeController };
//# sourceMappingURL=number.js.map
