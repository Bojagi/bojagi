const path = require('path')
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

function getPackages() {
  // hardcoded for now
  return ['cli', 'jest']
    .map(pkg => path.resolve(__dirname, 'packages', pkg))
}

function getConfigForPackage(pkgSrc) {
  const pkg = require(path.resolve(pkgSrc, 'package.json'))
  return {
    input: path.resolve(pkgSrc, 'src', 'index.ts'),
    external: Object.keys(pkg.dependencies || {}),
    plugins: [
      resolve({
        extensions,
      }),

      commonjs(),

      babel({
        exclude: ['node_modules'],
        extensions
      }),

    ],
    output: [
      { file: path.resolve(pkgSrc, pkg.main), format: 'cjs' },
      { file: path.resolve(pkgSrc, pkg.module), format: 'es' }
    ],  
  }
} 

module.exports = getPackages().map(getConfigForPackage);