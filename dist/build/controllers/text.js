import { create } from '../shared/create.js';

const textController = (input, _opts, parent) => {
    const controller = create('input', {
        type: 'textarea',
        classes: ['gooey-controller', 'gooey-controller-text'],
        value: input.state.value,
        parent,
        attributes: {
            spellcheck: 'false',
        },
    });
    return controller;
};

export { textController };
//# sourceMappingURL=text.js.map
