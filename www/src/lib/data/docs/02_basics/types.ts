import type { PageData } from '../../../../routes/docs/$types'
import type { Gooey } from '../../../../../../src'

export type Data = PageData

export type Example = Record<
	string,
	{
		code: string
		fn?: (gooey: Gooey) => void
	}
>
