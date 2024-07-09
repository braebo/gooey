import type { ControllerFactory } from './types'

import { create } from '../shared/create'

export const textController: ControllerFactory<HTMLInputElement> = (input, _opts, parent) => {
	const controller = create('input', {
		type: 'textarea',
		classes: ['gooey-controller', 'gooey-controller-text'],
		value: input.state.value,
		parent,
		attributes: {
			spellcheck: 'false',
		},
	})

	return controller
}
