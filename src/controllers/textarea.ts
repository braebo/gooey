import type { ControllerFactory } from './types'

import { create } from '../shared/create'

export const textareaController: ControllerFactory<HTMLInputElement> = (input, _opts, parent) => {
	const controller = create('input', {
		type: 'textarea',
		classes: ['gooey-controller', 'gooey-controller-textarea'],
		value: input.state.value,
		parent,
		attributes: {
			spellcheck: 'false',
		},
	})

	return controller
}
