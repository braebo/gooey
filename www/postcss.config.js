import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const dev = process.env.NODE_ENV !== 'production'

export default {
	plugins: [
		autoprefixer,
		!dev &&
			cssnano({
				preset: 'default',
			}),
	],
}
