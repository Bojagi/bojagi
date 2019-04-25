const path = require('path')
const babel = require('rollup-plugin-babel');

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
      babel({
        exclude: 'node_modules/**'
      })
    ],
    output: [
      { file: path.resolve(pkgSrc, pkg.main), format: 'cjs' },
      { file: path.resolve(pkgSrc, pkg.module), format: 'es' }
    ]
  }
} 

module.exports = getPackages().map(getConfigForPackage);