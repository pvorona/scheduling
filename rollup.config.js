import filesize from 'rollup-plugin-filesize'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [{ dir: 'dist' }],
  plugins: [typescript({ declaration: true }), filesize(), sourceMaps()],
  preserveModules: true,
}
