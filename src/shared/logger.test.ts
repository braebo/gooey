import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// A production build: esm-env's DEV is false there.
vi.mock('esm-env', () => ({ DEV: false, BROWSER: true }))

import { EventManager } from './EventManager'
import { Logger } from './logger'

describe('Logger outside dev', () => {
	let log: ReturnType<typeof vi.spyOn>
	let trace: ReturnType<typeof vi.spyOn>

	beforeEach(() => {
		// A consumer's VITE_FRACTILS_LOG_LEVEL="debug" reaches its production build too.
		Logger.LOG_LEVEL = 'debug'
		log = vi.spyOn(console, 'log').mockImplementation(() => {})
		trace = vi.spyOn(console, 'trace').mockImplementation(() => {})
	})

	afterEach(() => {
		Logger.LOG_LEVEL = undefined
		log.mockRestore()
		trace.mockRestore()
	})

	it('drops debug and trace, even at debug level', () => {
		const logger = new Logger('test')
		logger.fn('f').debug({ big: 'object' })
		logger.trace('stack')
		expect(log).not.toHaveBeenCalled()
		expect(trace).not.toHaveBeenCalled()
	})

	it("an EventManager's listeners log nothing", () => {
		const evm = new EventManager<{ change: number }>(['change'])
		evm.on('change', () => {})
		evm.on('change', () => {})
		expect(log).not.toHaveBeenCalled()
	})

	it('devOnly: false keeps debug, so the silence above is the gate', () => {
		new Logger('test', { devOnly: false }).debug('kept')
		expect(log).toHaveBeenCalledTimes(1)
	})

	it('info still logs', () => {
		new Logger('test').info('kept')
		expect(log).toHaveBeenCalledTimes(1)
	})
})
