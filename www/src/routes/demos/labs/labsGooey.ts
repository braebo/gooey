/**
 * The Labs panel — a tour of three recent additions:
 *
 * 1. `folder.addElement(title, content, opts)` — arbitrary DOM in a folder row, with a cleanup
 *    contract on `set()` and `dispose()`.
 * 2. `WindowManager`'s `storageId` — a stable localStorage key, so a dragged panel comes back
 *    where you left it after a reload.
 * 3. `registerWebMCP(gooey)` — publishes every control as a WebMCP tool for in-browser agents,
 *    and no-ops gracefully where `document.modelContext` doesn't exist.
 */

import type { InputElement, InputNumber, WebMCPHandle } from '../../../../../src/index'

import { Gooey, registerWebMCP } from '../../../../../src/index'
import { SCENE_DEFAULTS, type Scene } from './scene'
import { Ledger, goo, injectWidgetStyles, ledgerCard, mcpCard, sparkline, storageCard, swatches } from './widgets'

/**
 * The localStorage namespace.  `Gooey` appends its slugged title, so everything this panel
 * writes lives under `demo::labs::…`.
 */
const STORAGE_KEY = 'demo'

const SWATCH_HUES = [205, 265, 320, 15, 90, 160]

export interface LabsPanel {
	gooey: Gooey
	/** The handle `registerWebMCP` returned — disabled outside a WebMCP-capable browser. */
	webmcp: WebMCPHandle
	dispose(): void
}

export function createLabsGooey(scene: Scene): LabsPanel {
	injectWidgetStyles()

	const ledger = new Ledger()

	const gooey = new Gooey({
		title: 'Labs',
		themeMode: 'system',
		position: 'top-right',
		width: 375,
		// `position` and `size` are off by default.  Turning them on is what makes the
		// storageId fix visible: drag the panel, reload, it's still there.
		storage: { key: STORAGE_KEY, position: true, size: true },
	})

	//· Scene ·························································································

	// Bound inputs, so the WebMCP tools generated below drive the canvas directly.
	const sceneFolder = gooey.addFolder('scene')

	sceneFolder.bindNumber(scene.params, 'count', { min: 1, max: 80, step: 1 })
	sceneFolder.bindNumber(scene.params, 'speed', { min: -4, max: 4, step: 0.05 })
	sceneFolder.bindNumber(scene.params, 'radius', { min: 4, max: 180, step: 1 })
	const hueInput: InputNumber = sceneFolder.bindNumber(scene.params, 'hue', {
		min: 0,
		max: 360,
		step: 1,
	})
	sceneFolder.bindNumber(scene.params, 'curl', { min: -0.08, max: 0.08, step: 0.001 })
	sceneFolder.bindNumber(scene.params, 'fade', { min: 0, max: 0.4, step: 0.005 })
	sceneFolder.bindSwitch(scene.params, 'glow')
	sceneFolder.addButton('reseed', () => scene.reseed(), { text: 'scatter' })
	sceneFolder.addButton(
		'defaults',
		() => {
			Object.assign(scene.params, SCENE_DEFAULTS)
			sceneFolder.refresh()
		},
		{ text: 'reset' },
	)

	// Folders render in creation order, so this one is claimed early to keep it above the fold.
	// It gets filled in at the bottom of this function, after `registerWebMCP` has run.
	const webmcpFolder = gooey.addFolder('webmcp')

	//· addElement ····················································································

	const elementFolder = gooey.addFolder('addElement')

	// An empty title hands the row's full width to the content.
	const stage: InputElement = elementFolder.addElement('', sparkline(scene, ledger), {
		description:
			'Arbitrary DOM in a folder row. The mount function owns an animation frame; its cleanup cancels it.',
	})

	elementFolder.addButtonGrid('content', [
		[
			{ text: 'sparkline', onClick: () => stage.set(sparkline(scene, ledger)) },
			{ text: 'goo', onClick: () => stage.set(goo(ledger, scene.params.hue)) },
			{
				text: 'swatches',
				// A bare element rather than a mount function — the other content shape.
				onClick: () => stage.set(swatches(SWATCH_HUES, hue => hueInput.set(hue))),
			},
		],
	])

	elementFolder.addElement('', ledgerCard(ledger), {
		description: 'Every mount and cleanup, newest first. Swap the content above and watch them stay paired.',
	})

	//· Persistence ···················································································

	const storagePrefix = typeof gooey.opts.storage === 'object' ? gooey.opts.storage.key : ''

	const persistenceFolder = gooey.addFolder('persistence')

	persistenceFolder.addElement('', storageCard(storagePrefix, ledger), {
		description: `Live view of every localStorage key under "${storagePrefix}". Drag or resize the panel, then reload.`,
	})

	persistenceFolder.addButton(
		'forget layout',
		() => {
			for (const key of Object.keys(localStorage)) {
				if (key.startsWith(storagePrefix)) localStorage.removeItem(key)
			}
		},
		{
			text: 'clear keys',
			description: 'Wipes the saved position and size. Reload to land back at the default placement.',
		},
	)

	//· WebMCP ························································································

	// Registered last, so the walk sees every input above.  `InputElement` rows are skipped --
	// there's no value for an agent to set.
	const webmcp = registerWebMCP(gooey, { prefix: 'labs' })

	const mcpStatus: InputElement = webmcpFolder.addElement(
		'',
		mcpCard(() => webmcp, ledger),
		{
			description:
				'WebMCP is a W3C draft behind a Chrome origin trial. Without it, registerWebMCP returns a disabled handle instead of throwing.',
		},
	)

	// Added after registration on purpose: the first `refresh()` re-walks the gooey and picks
	// this button up as a tool, which is easier to see than to explain.
	webmcpFolder.addButton(
		'refresh tools',
		() => {
			webmcp.refresh()
			// Re-`set` rather than mutate: it also re-runs the card's cleanup, which the
			// lifecycle ledger records.
			mcpStatus.set(mcpCard(() => webmcp, ledger))
		},
		{ text: 're-walk' },
	)

	// Element rows are `saveable: false`, so the preset manager in the settings folder skips them
	// in both directions -- saving and loading a preset only moves the scene.

	return {
		gooey,
		webmcp,
		dispose() {
			// `registerWebMCP` wraps `gooey.dispose`, so this unregisters the tools too.
			gooey.dispose()
		},
	}
}
