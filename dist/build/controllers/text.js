import { create } from '../shared/create';
export const textController = (input, _opts, parent) => {
    const controller = create('input', {
        type: 'textarea',
        classes: ['fracgui-controller', 'fracgui-controller-text'],
        value: input.state.value,
        parent,
        attributes: {
            spellcheck: 'false',
        },
    });
    return controller;
};