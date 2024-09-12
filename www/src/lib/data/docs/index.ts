import type { Gooey } from '../../../../../src/Gooey'

export interface Example {
    code: string
    fn?: (gooey: Gooey) => void
}

export interface Description {
    description: string
}

export interface InfoSections {
    content: Content[]
    text?: string
}

export type Content = Example | Description | InfoSections

export interface SubSection {
    title: string
    content: Content[]
}
