import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const plugins = [autoprefixer]

if (process.env.NODE_ENV === 'production') {
	plugins.push(cssnano)
}

export default { plugins }
