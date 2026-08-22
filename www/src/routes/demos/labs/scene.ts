/**
 * A tiny additive-blend blob field.  It exists so the Labs demo's controls -- and the WebMCP
 * tools generated from them -- have something visible to move.
 */

// A type alias rather than an interface: `bindNumber`/`bindSwitch` constrain their target to
// `Record<string, any>`, and only aliases get TypeScript's implicit index signature.
export type SceneParams = {
	/** How many blobs are in the field. */
	count: number
	/** Multiplier on every blob's velocity. */
	speed: number
	/** Base blob radius in pixels. */
	radius: number
	/** Base hue in degrees.  Each blob offsets from it. */
	hue: number
	/** How much each blob's velocity curls per frame. */
	curl: number
	/** How quickly the previous frame fades out.  `0` leaves permanent trails. */
	fade: number
	/** Whether to draw the soft outer halo. */
	glow: boolean
}

export const SCENE_DEFAULTS: SceneParams = {
	count: 24,
	speed: 1,
	radius: 44,
	hue: 205,
	curl: 0.012,
	fade: 0.09,
	glow: true,
}

interface Blob {
	x: number
	y: number
	vx: number
	vy: number
	/** Per-blob radius jitter, multiplied by {@link SceneParams.radius}. */
	scale: number
	/** Degrees added to {@link SceneParams.hue}. */
	hueOffset: number
}

/** How many samples the sparkline widget can read back. */
const SAMPLE_LIMIT = 96

/** Sample every Nth frame, so the window covers ~13s of drift rather than a flat blip. */
const SAMPLE_EVERY = 8

export class Scene {
	readonly params: SceneParams = { ...SCENE_DEFAULTS }

	/**
	 * A rolling window of the lead blob's altitude, `0` (floor) to `1` (ceiling), newest last.
	 * The sparkline widget reads this every frame -- it's the demo's proof that `addElement`
	 * content can be live.  One blob rather than the field's average: an average over two dozen
	 * blobs flattens into a straight line.
	 */
	readonly samples: number[] = []

	#canvas: HTMLCanvasElement
	#ctx: CanvasRenderingContext2D
	#blobs: Blob[] = []
	#observer: ResizeObserver
	#frame = 0
	#ticks = 0
	#width = 0
	#height = 0
	#disposed = false

	constructor(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d')
		if (!ctx) throw new Error('Scene: canvas 2d context unavailable.')

		this.#canvas = canvas
		this.#ctx = ctx

		this.#observer = new ResizeObserver(() => this.#resize())
		this.#observer.observe(canvas)
		this.#resize()

		this.#frame = requestAnimationFrame(this.#tick)
	}

	/** Scatters every blob again, keeping the current params. */
	reseed(): void {
		this.#blobs = []
		this.samples.length = 0
	}

	dispose(): void {
		if (this.#disposed) return
		this.#disposed = true
		cancelAnimationFrame(this.#frame)
		this.#observer.disconnect()
	}

	#resize(): void {
		const dpr = Math.min(globalThis.devicePixelRatio || 1, 2)
		const rect = this.#canvas.getBoundingClientRect()

		this.#width = Math.max(1, Math.round(rect.width))
		this.#height = Math.max(1, Math.round(rect.height))

		this.#canvas.width = Math.round(this.#width * dpr)
		this.#canvas.height = Math.round(this.#height * dpr)
		this.#ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
	}

	#spawn(): Blob {
		const angle = Math.random() * Math.PI * 2
		const magnitude = 0.4 + Math.random() * 1.1

		return {
			x: Math.random() * this.#width,
			y: Math.random() * this.#height,
			vx: Math.cos(angle) * magnitude,
			vy: Math.sin(angle) * magnitude,
			scale: 0.5 + Math.random() * 0.9,
			hueOffset: Math.round((Math.random() - 0.5) * 90),
		}
	}

	#sync(): void {
		const { count } = this.params
		while (this.#blobs.length < count) this.#blobs.push(this.#spawn())
		if (this.#blobs.length > count) this.#blobs.length = count
	}

	#tick = (): void => {
		if (this.#disposed) return
		this.#frame = requestAnimationFrame(this.#tick)

		this.#sync()

		const ctx = this.#ctx
		const { speed, radius, hue, curl, fade, glow } = this.params
		const w = this.#width
		const h = this.#height

		// Fading to transparent rather than to a color keeps the canvas theme-agnostic.
		ctx.globalCompositeOperation = fade > 0 ? 'destination-out' : 'source-over'
		if (fade > 0) {
			ctx.fillStyle = `rgba(0, 0, 0, ${fade})`
			ctx.fillRect(0, 0, w, h)
		}

		ctx.globalCompositeOperation = 'lighter'

		for (const blob of this.#blobs) {
			// Rotate the velocity a little each frame -- straight lines look dead.
			const cos = Math.cos(curl)
			const sin = Math.sin(curl)
			const vx = blob.vx * cos - blob.vy * sin
			const vy = blob.vx * sin + blob.vy * cos
			blob.vx = vx
			blob.vy = vy

			blob.x += vx * speed
			blob.y += vy * speed

			if (blob.x < 0) ((blob.x = 0), (blob.vx = Math.abs(blob.vx)))
			if (blob.x > w) ((blob.x = w), (blob.vx = -Math.abs(blob.vx)))
			if (blob.y < 0) ((blob.y = 0), (blob.vy = Math.abs(blob.vy)))
			if (blob.y > h) ((blob.y = h), (blob.vy = -Math.abs(blob.vy)))

			const r = Math.max(2, radius * blob.scale)
			const blobHue = hue + blob.hueOffset
			const color = (alpha: number) => `hsl(${blobHue} 90% 62% / ${alpha})`

			const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, r)
			gradient.addColorStop(0, color(0.85))
			gradient.addColorStop(0.45, color(glow ? 0.28 : 0.05))
			gradient.addColorStop(1, color(0))

			ctx.fillStyle = gradient
			ctx.beginPath()
			ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2)
			ctx.fill()
		}

		const lead = this.#blobs[0]
		if (lead && ++this.#ticks % SAMPLE_EVERY === 0) {
			this.samples.push(1 - lead.y / h)
		}
		if (this.samples.length > SAMPLE_LIMIT) this.samples.shift()
	}
}
