import * as meta from './package.json'
import { terser } from 'rollup-plugin-terser'
import stripCode from 'rollup-plugin-strip-code'

const copyright = `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author.name}`
const dependencies = {
    'd3': 'd3',
    'js-yaml': 'jsyaml'
}

export default {
    external: Object.keys(dependencies),
    input: meta.module,
    plugins: [
        terser({output: {preamble: copyright}}),
        stripCode({
            start_comment: 'test-code',
            end_comment: 'end-test-code'
        })
    ],
    output: {
        globals: dependencies,
        file: meta.main,
        format: 'umd',
        name: 'mostrar',
        indent: false
    }
}
